// Storage nodes are predefined and come from STORAGE_NODES env variable. It's a semicolon-separated
// list of node names and addresses. Format: name0:address0;name1:address1.
//
// Spaces around names and addresses are stripped.

const nodes = (process.env.STORAGE_NODES || '')
    .split(/\s*;\s*/)
    .filter(Boolean)
    .map((node) => node.split(/\s*:\s*/))
    .map(([name, address]) => ({
        name,
        address,
    }))

export default nodes
