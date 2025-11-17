const db = require('../config/db.config');

const PackageModel = {
  // Create Package
  createPackage: async (packageData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Insert package
      const [result] = await connection.query(
        `INSERT INTO test_packages (
          tenant_id, package_name, package_code, description, category,
          total_price, discounted_price, discount_percent, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          packageData.tenant_id,
          packageData.package_name,
          packageData.package_code,
          packageData.description,
          packageData.category,
          packageData.total_price,
          packageData.discounted_price,
          packageData.discount_percent || 0,
          packageData.is_active !== false
        ]
      );

      const packageId = result.insertId;

      // Add tests to package
      if (packageData.test_ids && packageData.test_ids.length > 0) {
        for (const testId of packageData.test_ids) {
          await connection.query(
            `INSERT INTO package_tests (package_id, test_id) VALUES (?, ?)`,
            [packageId, testId]
          );
        }
      }

      await connection.commit();
      return { packageId, success: true };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Get All Packages
  getAllPackages: async (tenantId, filters = {}) => {
    let query = `
      SELECT p.*, COUNT(pt.test_id) as test_count
      FROM test_packages p
      LEFT JOIN package_tests pt ON p.package_id = pt.package_id
      WHERE p.tenant_id = ?
    `;
    const params = [tenantId];

    if (filters.is_active !== undefined) {
      query += ` AND p.is_active = ?`;
      params.push(filters.is_active);
    }

    if (filters.category) {
      query += ` AND p.category = ?`;
      params.push(filters.category);
    }

    if (filters.search) {
      query += ` AND (p.package_name LIKE ? OR p.package_code LIKE ?)`;
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ` GROUP BY p.package_id ORDER BY p.package_name`;

    const [packages] = await db.query(query, params);
    return packages;
  },

  // Get Package by ID
  getPackageById: async (packageId, tenantId) => {
    const [packages] = await db.query(
      `SELECT * FROM test_packages WHERE package_id = ? AND tenant_id = ?`,
      [packageId, tenantId]
    );

    if (packages.length === 0) return null;

    const packageData = packages[0];

    // Get tests in package
    const [tests] = await db.query(
      `SELECT t.* FROM tests t
       JOIN package_tests pt ON t.test_id = pt.test_id
       WHERE pt.package_id = ?`,
      [packageId]
    );

    packageData.tests = tests;
    return packageData;
  },

  // Update Package
  updatePackage: async (packageId, tenantId, updateData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Update package
      await connection.query(
        `UPDATE test_packages SET
          package_name = ?,
          package_code = ?,
          description = ?,
          category = ?,
          total_price = ?,
          discounted_price = ?,
          discount_percent = ?,
          is_active = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE package_id = ? AND tenant_id = ?`,
        [
          updateData.package_name,
          updateData.package_code,
          updateData.description,
          updateData.category,
          updateData.total_price,
          updateData.discounted_price,
          updateData.discount_percent,
          updateData.is_active,
          packageId,
          tenantId
        ]
      );

      // Update tests if provided
      if (updateData.test_ids) {
        // Remove existing tests
        await connection.query(
          `DELETE FROM package_tests WHERE package_id = ?`,
          [packageId]
        );

        // Add new tests
        for (const testId of updateData.test_ids) {
          await connection.query(
            `INSERT INTO package_tests (package_id, test_id) VALUES (?, ?)`,
            [packageId, testId]
          );
        }
      }

      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Delete Package
  deletePackage: async (packageId, tenantId) => {
    const [result] = await db.query(
      `DELETE FROM test_packages WHERE package_id = ? AND tenant_id = ?`,
      [packageId, tenantId]
    );
    return result.affectedRows > 0;
  },

  // Get Package Statistics
  getPackageStats: async (tenantId) => {
    const [stats] = await db.query(
      `SELECT 
        COUNT(*) as total_packages,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_packages,
        AVG(discounted_price) as avg_price,
        SUM(discount_percent) / COUNT(*) as avg_discount
      FROM test_packages
      WHERE tenant_id = ?`,
      [tenantId]
    );

    return stats[0];
  }
};

module.exports = PackageModel;
