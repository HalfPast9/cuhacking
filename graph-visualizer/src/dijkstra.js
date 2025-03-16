const API_URL = 'http://localhost:5000/run-script';

/**
 * Sends path data to the Python backend.
 * @param {Array} path - The path data to send.
 */
async function sendPathToPython(path) {
    console.log('Sending path to Python:', path);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path })
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Python Response:', result);

    } catch (error) {
        console.error('Error sending data to Python:', error);
    }
}

/**
 * Finds the shortest path using Dijkstra's algorithm.
 * @param {Array} nodes - List of nodes in the graph.
 * @param {Array} edges - List of edges in the graph.
 * @param {string} startNodeId - Starting node ID.
 * @param {string} endNodeId - Ending node ID.
 * @returns {Array} - Shortest path as an array of node IDs.
 */
export function findShortestPath(nodes, edges, startNodeId, endNodeId) {
    const distances = Object.fromEntries(nodes.map(node => [node.id, Infinity]));
    const previous = Object.fromEntries(nodes.map(node => [node.id, null]));
    const unvisited = new Set(nodes.map(node => node.id));

    distances[startNodeId] = 0;

    while (unvisited.size) {
        const currentNodeId = [...unvisited].reduce(
            (minNode, nodeId) =>
                distances[nodeId] < distances[minNode] ? nodeId : minNode
        );

        if (currentNodeId === endNodeId) break;

        unvisited.delete(currentNodeId);

        edges.forEach(edge => {
            if (edge.source === currentNodeId || edge.target === currentNodeId) {
                const neighbor = edge.source === currentNodeId ? edge.target : edge.source;
                if (!unvisited.has(neighbor)) return;

                const newDistance = distances[currentNodeId] + (edge.weight || 1);

                if (newDistance < distances[neighbor]) {
                    distances[neighbor] = newDistance;
                    previous[neighbor] = currentNodeId;
                }
            }
        });
    }

    const path = reconstructPath(previous, endNodeId);
    sendPathToPython(path);
    return path;
}

/**
 * Reconstructs the path from the 'previous' mapping.
 * @param {Object} previous - Mapping of nodes to their previous nodes.
 * @param {string} endNodeId - Ending node ID.
 * @returns {Array} - The reconstructed path.
 */
function reconstructPath(previous, endNodeId) { 
    const path = [];
    let currentNode = endNodeId;

    while (currentNode) {
        path.unshift(currentNode);
        currentNode = previous[currentNode];
    }

    return path;
}
