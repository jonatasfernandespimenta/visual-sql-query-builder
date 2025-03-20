export async function getMockedTables() {
  return [
    { id: 'user', parent: null, stepName: 'User', type: 'table' },
    { id: 'order', parent: null, stepName: 'Order', type: 'table' },
  ]
}
