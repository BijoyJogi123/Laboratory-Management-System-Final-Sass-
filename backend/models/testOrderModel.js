const db = require('../config/db.config');

const TestOrderModel = {
  // Create Test Order
  createOrder: async (orderData) => {
    const [result] = await db.query(
      `INSERT INTO test_orders (
        tenant_id, patient_id, test_id, package_id, order_number,
        order_date, status, tat_hours, priority, assigned_to, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderData.tenant_id,
        orderData.patient_id,
        orderData.test_id,
        orderData.package_id,
        orderData.order_number,
        orderData.order_date || new Date(),
        'ordered',
        orderData.tat_hours || 24,
        orderData.priority || 'normal',
        orderData.assigned_to,
        orderData.notes
      ]
    );
    return { orderId: result.insertId, success: true };
  },

  // Get All Orders
  getAllOrders: async (tenantId, filters = {}) => {
    let query = `
      SELECT to.*, 
        p.patient_name,
        t.test_name,
        pkg.package_name
      FROM test_orders to
      LEFT JOIN patients p ON to.patient_id = p.id
      LEFT JOIN lab_test_master t ON to.test_id = t.test_id
      LEFT JOIN test_packages pkg ON to.package_id = pkg.package_id
      WHERE to.tenant_id = ?
    `;
    const params = [tenantId];

    if (filters.status) {
      query += ` AND to.status = ?`;
      params.push(filters.status);
    }

    if (filters.priority) {
      query += ` AND to.priority = ?`;
      params.push(filters.priority);
    }

    if (filters.from_date) {
      query += ` AND to.order_date >= ?`;
      params.push(filters.from_date);
    }

    if (filters.to_date) {
      query += ` AND to.order_date <= ?`;
      params.push(filters.to_date);
    }

    query += ` ORDER BY to.order_date DESC`;

    const [orders] = await db.query(query, params);
    return orders;
  },

  // Get Order by ID
  getOrderById: async (orderId, tenantId) => {
    const [orders] = await db.query(
      `SELECT to.*, 
        p.patient_name, p.patient_contact,
        t.test_name,
        pkg.package_name
      FROM test_orders to
      LEFT JOIN patients p ON to.patient_id = p.id
      LEFT JOIN lab_test_master t ON to.test_id = t.test_id
      LEFT JOIN test_packages pkg ON to.package_id = pkg.package_id
      WHERE to.order_id = ? AND to.tenant_id = ?`,
      [orderId, tenantId]
    );
    return orders.length > 0 ? orders[0] : null;
  },

  // Update Order Status
  updateOrderStatus: async (orderId, tenantId, statusData) => {
    const statusField = `${statusData.status.replace('-', '_')}_date`;
    
    const [result] = await db.query(
      `UPDATE test_orders SET
        status = ?,
        ${statusField} = ?,
        notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE order_id = ? AND tenant_id = ?`,
      [
        statusData.status,
        new Date(),
        statusData.notes,
        orderId,
        tenantId
      ]
    );
    return result.affectedRows > 0;
  },

  // Assign Order
  assignOrder: async (orderId, tenantId, userId) => {
    const [result] = await db.query(
      `UPDATE test_orders SET
        assigned_to = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE order_id = ? AND tenant_id = ?`,
      [userId, orderId, tenantId]
    );
    return result.affectedRows > 0;
  },

  // Get Orders by Status
  getOrdersByStatus: async (tenantId, status) => {
    const [orders] = await db.query(
      `SELECT to.*, 
        p.patient_name,
        t.test_name
      FROM test_orders to
      LEFT JOIN patients p ON to.patient_id = p.id
      LEFT JOIN lab_test_master t ON to.test_id = t.test_id
      WHERE to.tenant_id = ? AND to.status = ?
      ORDER BY to.order_date DESC`,
      [tenantId, status]
    );
    return orders;
  },

  // Get Pending Orders
  getPendingOrders: async (tenantId) => {
    const [orders] = await db.query(
      `SELECT to.*, 
        p.patient_name,
        t.test_name,
        TIMESTAMPDIFF(HOUR, to.order_date, NOW()) as hours_elapsed
      FROM test_orders to
      LEFT JOIN patients p ON to.patient_id = p.id
      LEFT JOIN lab_test_master t ON to.test_id = t.test_id
      WHERE to.tenant_id = ? 
      AND to.status NOT IN ('report_ready', 'delivered')
      ORDER BY to.priority DESC, to.order_date ASC`,
      [tenantId]
    );
    return orders;
  },

  // Get Overdue Orders
  getOverdueOrders: async (tenantId) => {
    const [orders] = await db.query(
      `SELECT to.*, 
        p.patient_name,
        t.test_name,
        TIMESTAMPDIFF(HOUR, to.order_date, NOW()) as hours_elapsed
      FROM test_orders to
      LEFT JOIN patients p ON to.patient_id = p.id
      LEFT JOIN lab_test_master t ON to.test_id = t.test_id
      WHERE to.tenant_id = ? 
      AND to.status NOT IN ('report_ready', 'delivered')
      AND TIMESTAMPDIFF(HOUR, to.order_date, NOW()) > to.tat_hours
      ORDER BY hours_elapsed DESC`,
      [tenantId]
    );
    return orders;
  },

  // Get Order Statistics
  getOrderStats: async (tenantId) => {
    const [stats] = await db.query(
      `SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'ordered' THEN 1 ELSE 0 END) as ordered,
        SUM(CASE WHEN status = 'sample_collected' THEN 1 ELSE 0 END) as sample_collected,
        SUM(CASE WHEN status = 'in_lab' THEN 1 ELSE 0 END) as in_lab,
        SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing,
        SUM(CASE WHEN status = 'qa_check' THEN 1 ELSE 0 END) as qa_check,
        SUM(CASE WHEN status = 'report_ready' THEN 1 ELSE 0 END) as report_ready,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered,
        AVG(TIMESTAMPDIFF(HOUR, order_date, report_ready_date)) as avg_tat_hours
      FROM test_orders
      WHERE tenant_id = ? AND order_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
      [tenantId]
    );
    return stats[0];
  },

  // Delete Order
  deleteOrder: async (orderId, tenantId) => {
    const [result] = await db.query(
      `DELETE FROM test_orders WHERE order_id = ? AND tenant_id = ?`,
      [orderId, tenantId]
    );
    return result.affectedRows > 0;
  }
};

module.exports = TestOrderModel;
