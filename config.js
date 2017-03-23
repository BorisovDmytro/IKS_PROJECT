var config = {
  ip: "127.0.0.1",
  port: "8080",
  id_admin: "127.0.0.1",
  port_admin: "8080",
  dbUrl: "mongodb://127.0.0.1:27017/iks",
  uploadDir: __dirname + "/upload"
}

export default (key, def) => {
  return config[key] || def;
}