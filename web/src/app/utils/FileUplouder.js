export default class FileUplouder {
  constructor(url) {
    this.request = new XMLHttpRequest();
    this.url     = url;
  }

  onProgress(cb) {
    this.request.upload.addEventListener("progress", cb);
  }

  onReadyState(cb) {
    this.request.onreadystatechange = () => {
      cb(this.request.readyState, this.request.responseText);
    }
  }

  onError(cb) {
    this.request.upload.addEventListener("error", cb);
  }

  send(file, url) {
    let data = new FormData(); 
    data.append('file', file);

    this.request.open("post", url || this.url);
    this.request.send(data);
  }
}