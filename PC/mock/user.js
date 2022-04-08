const Mock = require('mockjs')

// 拓展mockjs
Mock.Random.extend({

  phone: function () {

    var phonePrefixs = ['132', '135', '189'] // 自己写前缀哈
    return this.pick(phonePrefixs) + Mock.mock(/\d{8}/) //Number()
  }
})

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['superAdmin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    nickname: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    nickname: 'Normal Editor'
  }
}

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

const usersList = []
const count = 100

for (let i = 0; i < count; i++) {
  usersList.push(Mock.mock({
    id: '@increment',
    userId: '@increment',
    realName: '@cname',
    account: Mock.Random.string('lower',6,20),
    phone: '@phone',
    email: '@email',
    createData: '@datetime',
    statusFlag: Mock.Random.integer(1,2)
  }))
}

module.exports = [
  // user login
  {
    url: '/loginApi',
    type: 'post',
    response: config => {
      const { account } = config.body
      const token = tokens[account]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: '00000',
        data: token
      }
    }
  },

  // get user info
  {
    url: '/getCurrentLoginUserInfo\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'+token
        }
      }

      return {
        code: '00000',
        data: info
      }
    }
  },

  // get user list
  {
    url: '/sysUser/page\.*',
    type: 'get',
    response: config => {
      const { importance, type, title, pageNo = 1, pageSize = 20, sort } = config.query

      let mockList = usersList.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < pageSize * pageNo && index >= pageSize * (pageNo - 1))

      return {
        code: '00000',
        data: {
          totalRows: mockList.length,
          rows: pageList
        }
      }
    }
  },

  // user logout
  {
    url: '/logoutAction',
    type: 'post',
    response: _ => {
      return {
        code: '00000',
        data: 'success'
      }
    }
  }
]
