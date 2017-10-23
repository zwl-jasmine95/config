
import '../sass/a.scss'
import axios from 'axios'
axios.get(
    '/api/articles/page?code=apply_article_document&size=10&page=1'
).then(res => {
    console.log(res);
});