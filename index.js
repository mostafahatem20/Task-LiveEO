import { globby } from 'globby'
import fs from 'fs'
const files = await globby('**/*.tif')

const getTIFfilesbysize = () => {
  const response = []
  for (let file of files) {
    const fileSizeInBytes = fs.statSync(file).size
    let path = file.split('/')
    response.push({ name: path[path.length - 1], fileSizeInBytes })
  }
  // ordering ascendingly by size
  response.sort((a, b) => (a.fileSizeInBytes > b.fileSizeInBytes ? 1 : -1))
  console.log(response)
}

const movefiles = () => {
  const folder = './all_tifs'
  const oldfolder = './2019-10-15'
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)

    console.log('Folder Created Successfully.')
  }
  for (let file of files) {
    let path = file.split('/')
    fs.rename(
      './' + file,
      folder + '/' + path[path.length - 1],
      function (err) {
        if (err) throw err
      }
    )
  }
  if (fs.existsSync(folder)) {
    fs.rmdir(oldfolder, { recursive: true, force: true }, (err) => {
      if (err) {
        return console.log('error occurred in deleting directory', err)
      }

      console.log('Directory deleted successfully')
    })
  }
}
const splitAccordingToBand = () => {
  for (let file of files) {
    const path = file.split('/')
    const name = path[path.length - 1]
    const folder = './all_tifs/' + name.split('_')[4]
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder)

      console.log(folder + ' Folder Created Successfully.')
    }
    fs.rename(
      './' + file,
      folder + '/' + path[path.length - 1],
      function (err) {
        if (err) throw err
      }
    )
  }
}

const fileManagementTask = () => {
  getTIFfilesbysize()
  /* move files to all_tifs and splitAccordingToBand could have been done in one step but splitted them into 2 sub-tasks for
   demonstration*/
  movefiles()
  splitAccordingToBand()
}

fileManagementTask()
