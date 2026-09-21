async getDemographics(filters = {}) {
  try {
    const whereClause = await this._buildWhereClause(filters);
    excludeRejectedByDefault(whereClause, filters);

    const [
      totalPopulation, residentsAddedThisMonth, maleCount, femaleCount,
      workingAgeCount, childrenCount, ageGroups, civilStatusStats,
      educationStats, occupationStats, voterStats, seniorCitizenStats,
      pwdStats, soloParentStats, residentsByPurok, oldestResident,
      employmentCategories, dependencyRatio, neetCount, outOfSchoolYouth,
    ] = await Promise.all([
      Resident.count({ where: whereClause }),
      Resident.count({ where: { ...whereClause, createdAt: { [Op.gte]: startOfCurrentMonth() } } }),
      Resident.count({ where: { ...whereClause, gender: "MALE" } }),
      Resident.count({ where: { ...whereClause, gender: "FEMALE" } }),
      Resident.count({ where: { ...whereClause, age: { [Op.between]: [18, 64] } } }),
      Resident.count({ where: { ...whereClause, age: { [Op.lte]: 5 } } }),
      this._getAgeGroups(whereClause),
      this._getCivilStatusStats(whereClause),
      this._getEducationStats(whereClause),
      this._getOccupationStats(whereClause),
      this._getVoterStats(whereClause),
      this._getSeniorCitizenStats(whereClause),
      this._getPWDStats(whereClause),
      this._getSoloParentStats(whereClause),
      this._getResidentsByPurok(whereClause),
      Resident.findOne({
        where: whereClause,
        order: [['age', 'DESC']],
        attributes: ['id', 'firstName', 'lastName', 'age', 'gender', 'householdId'],
        include: [{ model: Household, as: 'household', attributes: ['purok'], required: false }],
      }),
      this._getEmploymentCategories(whereClause),
      this._getDependencyRatio(whereClause),
      this._getNEETCount(whereClause),
      this._getOutOfSchoolYouth(whereClause),
    ]);

    return {
      totalPopulation,
      residentsAddedThisMonth,
      workingAgeCount,
      childrenCount,
      genderDistribution: {
        male: maleCount,
        female: femaleCount,
        malePercentage: totalPopulation > 0 ? ((maleCount / totalPopulation) * 100).toFixed(2) : 0,
        femalePercentage: totalPopulation > 0 ? ((femaleCount / totalPopulation) * 100).toFixed(2) : 0,
      },
      ageGroups,
      civilStatus: civilStatusStats,
      education: educationStats,
      occupation: occupationStats,
      voters: voterStats,
      seniorCitizens: seniorCitizenStats,
      pwd: pwdStats,
      soloParents: soloParentStats,
      residentsByPurok,
      oldestResident: oldestResident ? {
        name: `${oldestResident.firstName} ${oldestResident.lastName}`,
        age: oldestResident.age,
        purok: oldestResident.household?.purok || '-',
      } : null,
      employmentCategories,
      dependencyRatio,
      neetCount,
      outOfSchoolYouth,
    };
  } catch (error) {
    logger.error("Error getting demographics:", error);
    throw error;
  }
}
