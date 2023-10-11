const baseURL = 'https://cargokite.cdn.prismic.io/api/v2'
let ref = ''
const access_token = 'MC5aU1Ytb0JBQUFDSUFlY1Vz.FGrvv70uNe-_ve-_ve-_ve-_vRfvv73vv73vv73vv73vv73vv73vv73vv73vv71877-977-9R--_ve-_ve-_vXrvv73vv73vv73vv73vv70';

 /**
  * parse graphQuery
  * @param {String} query
  * @return {String}
  */
function buildGraphQuery(query){
    return query.replace(/\s+/g,'').replaceAll('{','{\n').replaceAll('}','\n}')
}

 /**
  * build API
  * @param {String} path
  * @param {Object} params
  * @return {Object}
  */
async function buildAPI(path,params){
    const url = new URL(baseURL + path);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    const res = await fetch(url);
    return res.json();
}

 /**
  * ref is required in every Prismic API. ref stands for a specific version of our content
  * build API within ref
  * @param {String} path
  * @return {Object}
  */
async function buildAPIWithRef(params){
    if(!ref){
        ref=await getMasterRef();
    }
    return buildAPI('/documents/search',{
        ...params,
        access_token,
        ref
    })
}

 /**
  * get master ref
  * @return {String}
  */
async function getMasterRef(){
    const params = {
        access_token
    }
    const res = await buildAPI('',params);
    return res.refs[0].ref;
}

 /**
  * get list of category
  * @param {String} type
  * @param {Number} pageNum
  * @param {Number} pageSize
  * @param {'asc' | undefined} orderBy
  * @return {Array}
  */
  async function getAllDataByType(type,orderBy, pageNum=1,pageSize=100){
    const query = {
        q:`[[at(document.type,"${type}")]]`,
        orderings:`[document.first_publication_date ${orderBy ==='asc'?"": "desc"}]`,
        pageNum,
        pageSize
    }
    const data= await buildAPIWithRef(query);
    return data.results;
}

 /**
  * get detail by uid - now by slug
  * @param {String} type
  * @param {String} uid
  * @return {Object}
  */
  async function getDetail(type,uid){
    const query = {
        q:`[[at(my.${type}.uid,"${uid}")]]`
    }
    const data= await buildAPIWithRef(query);
    return data.results[0]
}

 /**
  * get list of authors except the author has the passed uid
  * @param {String} uid
  * @param {Number} pageNum
  * @param {Number} pageSize
  * @return {Array}
  */
async function getOtherAuthor(uid,pageNum=1,pageSize=100){
    // const uid = 'a5069d01-7a07-4159-8546-3bd44c6a6795'
    const queryOthers = {
    q:`[[at(document.type,"author")][not(my.author.uid,"${uid}")]]`,
    pageNum,
    pageSize
    }
    const authors = await buildAPIWithRef(queryOthers);
    await Promise.all(authors.results.map(async (a)=>{
    const queryGetTotal = {
        q:`[[at(document.type,"blog")][at(my.blog.author,"${a.id}")]]`,
        graphQuery: buildGraphQuery(`{
            blog {
                title
            }
        }`)
    }
    const data = await buildAPIWithRef(queryGetTotal);
    a.data.total_post=data.total_results_size
    }))
    return authors.results;
}

 /**
  * get list of blog by category
  * @param {String} categoryId
  * @param {Number} pageNum
  * @param {Number} pageSize
  * @param {'asc' | undefined} orderBy
  * @return {Array}
  */
async function getAllBlogsByCategory(categoryId,orderBy,pageNum=1,pageSize=100){
    const query = {
        q:`[[at(document.type,"blog")][at(my.blog.category,"${categoryId}")]]`,
        orderings:`[document.last_publication_date ${orderBy ==='asc'?"": "desc"}]`,
        pageNum,
        pageSize
    }
    const data= await buildAPIWithRef(query);
    return data.results;
}

 /**
  * get list of blog by author
  * @param {String} categoryId
  * @param {Number} pageNum
  * @param {Number} pageSize
  * @param {'asc' | undefined} orderBy
  * @return {Array}
  */
async function getAllBlogsByAuthor(authorId,orderBy,pageNum=1,pageSize=100){
    const query = {
        q:`[[at(document.type,"blog")][at(my.blog.author,"${authorId}")]]`,
        orderings:`[document.last_publication_date ${orderBy ==='asc'?"": "desc"}]`,
        pageNum,
        pageSize
    }
    const data= await buildAPIWithRef(query);
    return data.results;
}

 /**
  * get list of blog by author
  * @param {String} categoryId
  * @param {Number} pageNum
  * @param {Number} pageSize
  * @param {'asc' | undefined} orderBy
  * @return {Array}
  */
async function getAllBlogsByAuthorByCategory(authorId,orderBy,categoryId,pageNum=1,pageSize=100){
    const query = {
        q:`[[at(document.type,"blog")][at(my.blog.author,"${authorId}")][at(my.blog.category,"${categoryId}")]]`,
        orderings:`[document.last_publication_date ${orderBy ==='asc'?"": "desc"}]`,
        pageNum,
        pageSize
    }
    const data= await buildAPIWithRef(query);
    return data.results;
}