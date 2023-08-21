import request from '@/utils/request'

// 文章分类 - 获取文章分类接口
export const artGetArticleListService = () => {
  return request.get('/my/cate/list')
}

// 文章分类 - 增加文章分类接口
export const artAddChannelService = (data) => request.post('/my/cate/add', data)

// 文章分类 - 编辑 & 更新文章分类
export const artUpdateChannelService = (data) =>
  request.put('/my/cate/info', data)

// 文章分类 - 删除文章分类接口
export const artDelChannelService = (id) =>
  request.delete('/my/cate/del', {
    params: { id }
  })

// 文章管理 - 获取文章列表
export const artGetArticleListsService = (params) =>
  request.get('/my/article/list', {
    params
  })

// 文章管理 - 添加文章
// 注意： data需要是一个formData格式的对象
export const artPublishArticleService = (data) =>
  request.post('/my/article/add', data)

// 文章管理 - 获取文章详情
export const artGetArticleDetailsService = (id) =>
  request.get('/my/article/info', {
    params: { id }
  })

// 文章管理 - 更新文章详情
export const artArticleUpdateService = (data) => {
  request.put('/my/article/info', data)
}

// 文章管理 - 删除文章
export const artDelArticleService = (id) => {
  request.delete('/my/article/info', {
    params: { id }
  })
}
