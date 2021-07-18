import Router from "koa-router";

var router = new Router();
router
    .get('/', async (ctx) => {
        ctx.body = 'Fxxk the covid-19, get vax today!';   
    })
const homeRoute = router.routes();

export { homeRoute }