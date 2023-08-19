import request from '@/utils/request'

// 获取文章分类接口
export const artGetArticleListService = () => {
  return request.get('/my/cate/list')
}
