class FamilyTreeService {
  // Build family tree for a resident. No fixed generation cap - depth is
  // data-bound; the `visited` Set in _buildTreeRecursive guards against
  // cycles independently of this number, so it's just a defensive ceiling.
  async buildFamilyTree(residentId, maxGenerations = 999) {
    try {
      const resident = await Resident.findByPk(residentId, {
        include: [{ model: Household, as: "household" }],
      });

      if (!resident) {
        throw new Error("Resident not found");
      }

      const tree = await this._buildTreeRecursive(
        resident,
        1,
        maxGenerations,
        new Set(),
      );
      return tree;
    } catch (error) {
      logger.error("Error building family tree:", error);
      throw error;
    }
  }

  // Recursive tree building
  async _buildTreeRecursive(resident, generation, maxGenerations, visited) {
    if (generation > maxGenerations || visited.has(resident.id)) {
      return null;
    }

    visited.add(resident.id);

    const node = {
      id: resident.id,
      name: `${resident.firstName} ${resident.lastName}`,
      firstName: resident.firstName,
      lastName: resident.lastName,
      birthDate: resident.birthDate,
      deathDate: resident.dateOfDeath,
      age: resident.age,
      gender: resident.gender,
      status: resident.status,
      isDeceased: resident.status === RESIDENT_STATUS.DECEASED,
      generation,
      householdId: resident.householdId,
      profilePhoto: resident.profilePhoto,
      children: [],
      parents: [],
      siblings: [],
      spouse: null,
    };

    // Get family relationships with residents included
    const relationships = await FamilyRelation.findAll({
      where: {
        [Op.or]: [{ residentId1: resident.id }, { residentId2: resident.id }],
        isActive: true,
      },
      include: [
        { model: Resident, as: "resident1", attributes: [
          "id", "firstName", "lastName", "birthDate", "dateOfDeath",
          "age", "gender", "status", "verificationStatus", "householdId", "profilePhoto",
        ]},
        { model: Resident, as: "resident2", attributes: [
          "id", "firstName", "lastName", "birthDate", "dateOfDeath",
          "age", "gender", "status", "verificationStatus", "householdId", "profilePhoto",
        ]},
      ],
    });

    // Process relationships
    for (const relation of relationships) {
      const otherResident =
        relation.residentId1 === resident.id
          ? relation.resident2
          : relation.resident1;

      if (!otherResident || visited.has(otherResident.id)) continue;
      // A relationship can only be created between two VERIFIED residents,
      // but a resident's status can still change afterward - skip the node
      // here too so the tree can't surface someone who no longer qualifies
      // as a confirmed relative.
      if (otherResident.verificationStatus !== VERIFICATION_STATUS.VERIFIED) continue;

      switch (relation.relationshipType) {
        case RELATIONSHIP_TYPES.PARENT:
          if (relation.residentId1 === resident.id) {
            const childNode = await this._buildTreeRecursive(
              otherResident, generation + 1, maxGenerations, new Set(visited),
            );
            if (childNode) node.children.push(childNode);
          } else {
            const parentNode = await this._buildTreeRecursive(
              otherResident, generation - 1, maxGenerations, new Set(visited),
            );
            if (parentNode) node.parents.push(parentNode);
          }
          break;

        case RELATIONSHIP_TYPES.CHILD:
          if (relation.residentId2 === resident.id) {
            const parentNode = await this._buildTreeRecursive(
              otherResident, generation - 1, maxGenerations, new Set(visited),
            );
            if (parentNode) node.parents.push(parentNode);
          } else {
            const childNode = await this._buildTreeRecursive(
              otherResident, generation + 1, maxGenerations, new Set(visited),
            );
            if (childNode) node.children.push(childNode);
          }
          break;

        case RELATIONSHIP_TYPES.PARTNER:
        case RELATIONSHIP_TYPES.SPOUSE:
          const spouseNode = await this._buildTreeRecursive(
            otherResident, generation, maxGenerations, new Set(visited),
          );
          if (spouseNode) node.spouse = spouseNode;
          break;

        case RELATIONSHIP_TYPES.SIBLING:
          const siblingNode = await this._buildTreeRecursive(
            otherResident, generation, maxGenerations, new Set(visited),
          );
          if (siblingNode) node.siblings.push(siblingNode);
          break;

        case RELATIONSHIP_TYPES.COUSIN:
          // Cousins are lateral - treated as extended siblings at the same generation
          const cousinNode = await this._buildTreeRecursive(
            otherResident, generation, maxGenerations, new Set(visited),
          );
          if (cousinNode) node.siblings.push(cousinNode);
          break;
      }
    }

    return node;
  }
}
