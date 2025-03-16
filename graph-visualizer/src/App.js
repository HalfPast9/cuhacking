import React, { useState, useEffect } from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import { findShortestPath as dijkstra } from './dijkstra';
import { initialNodes, initialEdges } from './graphData';

const highlightPath = (path) =>
    initialEdges.map(edge => ({
        ...edge,
        animated: path.includes(edge.source) && path.includes(edge.target),
    }));

const PathSelector = ({ nodes, startNode, setStartNode, endNode, setEndNode, onFindPath }) => (
    <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
        <label>
            Start Node:
            <select value={startNode} onChange={(e) => setStartNode(e.target.value)}>
                {nodes.map(node => (
                    <option key={node.id} value={node.id}>
                        {node.data.label}
                    </option>
                ))}
            </select>
        </label>

        <label>
            End Node:
            <select value={endNode} onChange={(e) => setEndNode(e.target.value)}>
                {nodes.map(node => (
                    <option key={node.id} value={node.id}>
                        {node.data.label}
                    </option>
                ))}
            </select>
        </label>

        <button onClick={onFindPath}>Find Path</button>
    </div>
);

function App() {
    const [path, setPath] = useState([]);
    const [startNode, setStartNode] = useState('1');
    const [endNode, setEndNode] = useState('9');
    const [socket, setSocket] = useState(null);
    const [serverResponse, setServerResponse] = useState('');

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');
        ws.onopen = () => console.log('Connected to WebSocket server');
        ws.onmessage = (event) => setServerResponse(event.data);
        ws.onerror = (error) => console.error('WebSocket Error:', error);
        ws.onclose = () => console.log('WebSocket connection closed');

        setSocket(ws);

        return () => ws.close();
    }, []);

    const handlePathFind = () => {
        const shortestPath = dijkstra(initialNodes, initialEdges, startNode, endNode);
        setPath(shortestPath);

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ path: shortestPath }));
        } else {
            console.error('WebSocket is not connected');
        }
    };

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlow
                nodes={initialNodes}
                edges={highlightPath(path)}
                fitView
            >
                <MiniMap />
                <Controls />
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>

            <PathSelector
                nodes={initialNodes}
                startNode={startNode}
                setStartNode={setStartNode}
                endNode={endNode}
                setEndNode={setEndNode}
                onFindPath={handlePathFind}
            />

            {serverResponse && (
                <div style={{
                    position: 'absolute', 
                    top: 20, 
                    right: 20, 
                    background: '#f0f0f0', 
                    padding: '10px', 
                    borderRadius: '8px'
                }}>
                    <strong>Server Response:</strong> {serverResponse}
                </div>
            )}
        </div>
    );
}

export default App;
