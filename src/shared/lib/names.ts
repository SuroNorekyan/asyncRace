const BRANDS = [
  'Tesla',
  'Ford',
  'BMW',
  'Audi',
  'Mercedes',
  'Volvo',
  'Toyota',
  'Honda',
  'Nissan',
  'Mazda',
  'Porsche',
  'Lexus',
];
const MODELS = [
  'Model S',
  'Model 3',
  'Mustang',
  'Civic',
  'Supra',
  'CX-5',
  'A6',
  'S3',
  'GLB',
  'C-Class',
  'V90',
  'Roadster',
];

export const randomName = () => {
  const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
  const model = MODELS[Math.floor(Math.random() * MODELS.length)];
  return `${brand} ${model}`;
};

export default randomName;
