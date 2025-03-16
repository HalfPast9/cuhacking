export const initialNodes = [
   { id: '1', position: { x: -500, y: 515 }, data: { label: 'Leeds' } },
   { id: '2', position: { x: -250, y: 150 }, data: { label: 'Stormont-Dundas' } },
   { id: '3', position: { x: 0, y: 225 }, data: { label: 'Residence Commons' } },
   { id: '4', position: { x: -100, y: 300 }, data: { label: 'Lennox-Addington' } },
   { id: '5', position: { x: 0, y: 375 }, data: { label: 'Prescott/Renfrew' } },
   { id: '6', position: { x: 0, y: 515 }, data: { label: 'Lanark/Frontenac' } },
   { id: '7', position: { x: 250, y: 515 }, data: { label: 'Minto' } },
   { id: '8', position: { x: -250, y: 515 }, data: { label: 'Nicol' } },
   { id: '9', position: { x: 0, y: 615 }, data: { label: 'Architecture Bldg' } },
];

export const initialEdges = [
   { id: 'e1-8', source: '1', target: '8', weight: 1 },
   { id: 'e2-3', source: '2', target: '3', weight: 1 },
   { id: 'e3-4', source: '3', target: '4', weight: 1 },
   { id: 'e4-5', source: '4', target: '5', weight: 1 },
   { id: 'e5-6', source: '5', target: '6', weight: 1 },
   { id: 'e6-7', source: '6', target: '7', weight: 1 },
   { id: 'e5-8', source: '5', target: '8', weight: 1 },
   { id: 'e6-8', source: '6', target: '8', weight: 1 },
   { id: 'e7-9', source: '7', target: '9', weight: 1 },
   { id: 'e8-9', source: '8', target: '9', weight: 1 }
];
