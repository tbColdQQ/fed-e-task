// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const axios = require('axios')
const baseURL = "http://qm.tbcold.com:1337"

module.exports = function (api) {
  api.loadSource(async ({ addCollection }) => {
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api/
    const followers = addCollection('Follower')
    const followings = addCollection('Following')
    const repos = addCollection('Repo')

    const followerData = await axios.get('https://api.github.com/users/tbColdQQ/followers?page=1&per_page=9')
    // console.log('followerData--->', followerData.data)

    const followingData = await axios.get('https://api.github.com/users/tbColdQQ/following?page=1&per_page=9')
    // console.log('followingData--->', followingData.data)

    const repoData = await axios.get('https://api.github.com/users/tbColdQQ/repos')
    // console.log('repoData--->', repoData.data)

    followerData.data.forEach(item => {
      followers.addNode(item)
    })
    if(followerData.data.length == 0) {
      followers.addNode({
        id: 0,
        avatar_url: '',
        html_url: '',
        login: ''
      })
    }

    followingData.data.forEach(item => {
      followings.addNode(item)
    })

    repoData.data.forEach(item => {
      repos.addNode(item)
    })

    const userBaseInfoData = await axios.get('https://api.github.com/users/tbColdQQ')
    // console.log('userBaseInfoData--->', userBaseInfoData.data)

    const adminUser = addCollection('Author')
    adminUser.addNode(userBaseInfoData.data)
    
  })

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  })
}
