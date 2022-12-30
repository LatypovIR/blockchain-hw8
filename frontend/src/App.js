import './App.css'
import all from 'it-all'
import React from 'react'
import { ethers } from 'ethers'
import * as IPFS from 'ipfs-core'
import { concat } from 'uint8arrays/concat'
import Artifact from './contracts/Store.json'
import contractAddress from './contracts/deploy-address.json'


export class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
        cid: "<empty>",
        file: null,
        image: null,
        url: null,
        node: undefined
    }

    this._provider = new ethers.providers.JsonRpcBatchProvider("http://127.0.0.1:8545/")
    this._contract = new ethers.Contract(
        contractAddress.Store,
        Artifact.abi,
        this._provider.getSigner('0x2546BcD3c84621e976D8185a91A922aE77ECEc30')
    )

    this.saveFile = this.saveFile.bind(this)
    this.removeFile = this.removeFile.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
    this.loadFile = this.loadFile.bind(this)
  }

  render() {
    if (this.state.node === undefined) {
      if (!this._startNodeCreation) {
        this._startNodeCreation = true
        this.CreateIPFSNode()
        return
      }
      return Loading()
    }

    if (this.state.file !== null) {
      return (
          <div className='App'>
              <button className='file-upload-btn' type='button' onClick={this.uploadFile}>Upload</button>
              <div className='file-upload-content'>
                  <img className='file-upload-image' src={this.state.url} alt='' />
                  <div className='image-title-wrap'>
                      <button type='button' onClick={this.removeFile} className='remove-image'>
                          Clear
                      </button>
                  </div>
              </div>
              <div className='cid-text'>
                  <h3>Active cid = {this.state.cid}</h3>
              </div>
          </div>
      )
  }
  if (this.state.image !== null) {
      return (
          <div className='App'>
              <div className='file-upload-content'>
                  <button className='remove-downloaded-btn' type='button' onClick={this.removeFile}>Back</button>
                  <img className='file-upload-image' src={this.state.image} alt='' />
              </div>
              <h3>Active cid = {this.state.cid}</h3>
          </div>
      )
  }
  return (
      <div className='App'>
          <button className='glow-on-hover' type='button' onClick={this.loadFile}>
            <h3>Download</h3>
          </button>
          <div className='container'>
              <input className='file-upload-input' type='file' onChange={this.saveFile} accept='image/png' />
              <h3>drop or select PNG</h3>
          </div>
          <h3>Active cid = {this.state.cid}</h3>
      </div>
  )
  }

  async saveFile(event) {
    var file = event.target.files[0]
    this.setState({
        file: file,
        url: await this._readDataUrlAsync(file)
    })
  }

  removeFile() {
    this.setState({
        file: null,
        url: null,
        image: null,
    })
  }

  async CreateIPFSNode() {
      this.setState({
          node: await IPFS.create()
      })
  }
  
  async uploadFile() {
      const content = await this._readFileAsync(this.state.file)
      const result = await this.state.node.add(content)
      const cid = result.cid
      await this._contract.setFile(cid.toString())

      this.setState({
        cid: cid.toString(),
        file: null,
        url: null,
        image: null,
      })
  }

  async loadFile() {
      const cid = await this._contract.getFile()
      const bytes = concat(await all(this.state.node.cat(cid)))
      const image = new Blob([bytes.buffer], { type: "image/png" })
      const url = window.URL.createObjectURL(image)

      this.setState({ 
        cid: cid.toString(), 
        file: null, 
        url: null, 
        image: url 
      })
  }


  async _readDataUrlAsync(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.onload = () => {
            resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
  }

  async _readFileAsync(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.onload = () => {
            resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsArrayBuffer(file)
    })
  }

}

function Loading() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Please await, loading...
        </p>
      </header>
    </div>
  )
}

export default App
