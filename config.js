var config = {
  ip: "0.0.0.0",
  port: "8080",
  dbUrl: "mongodb://127.0.0.1:27017/iks"
}

export default (key, def) => {
  return config[key] || def;
}