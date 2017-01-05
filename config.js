var config = {
  ip: "192.168.0.105",
  port: "8080",
  dbUrl: "mongodb://127.0.0.1:27017/iks"
}

export default (key, def) => {
  return config[key] || def;
}