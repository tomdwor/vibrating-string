export function two_points_to_line (xa, ya, xb, yb) {
  let a = (ya - yb) / (xa - xb);
  let b = ya - ((ya - yb) / (xa - xb)) * xa;

  // y = ax + b
  return {'a': a, 'b': b};
}
