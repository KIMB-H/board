const express = require('express');
const router = express.Router();
const template = require('../views/template.js');
const db = require('../lib/db.js');
const member = require('../lib/member.js');
const form = require('../views/form.js');

router.get('/', (request, response) => {
    db.getConnection((err, conn) => {
        let body = '';
        if (err) {
            conn.release();
            response.send('db 연결에 실패하였습니다.');
            throw err;
        }
        else {
            const sql = 'select * from topic;';
            const authorSql = 'select * from user';
            conn.query(authorSql, (err2, result) => {
                if (err2) {
                    conn.release();
                    response.send('sql 실패');
                    throw err2;
                }
                else
                    body += template.authorList(result);
            });

            conn.query(sql, (err2, result) => {
                if (err2) {
                    conn.release();
                    response.send('sql 실패');
                    throw err2;
                }
                else {
                    body += template.topicList(result);
                    const view = template.HTML(body, member.statusUI(request, response));
                    response.send(view);
                }
            })
        }
        conn.release();
    });
});

router.post('/', (request, response) => {
    const search = request.body.search;

    db.getConnection((err, conn) => {
        if (err) {
            conn.release();
            response.redirect('/');
            throw err;
        }
        else {
            const sql = 'select * from topic where title=? or description=? or User_id=?'; //수정사항 : search 내용이 포함되기만 해도 검색되도록 수정
            conn.query(sql, [search, search, search], (err2, result) => {
                if (err2) {
                    conn.release();
                    response.redirect('/');
                    throw err2;
                }
                let body = '';
                if (result.length) {
                    body += template.topicList(result);
                } else body += '검색하신 정보가 존재하지 않습니다.';
                const view = template.HTML(body);
                response.send(view);
            });
        }
        conn.release();
    });
});

router.get('/create', (request, response) => {
    if (member.isOwner(request, response)) {
        const view = template.HTML(form.createTopic(), member.statusUI(request, response));
        response.send(view);
    } else {
        response.redirect('/member/login');
    }
})

router.post('/create', (request, response) => {
    if (!member.isOwner(request, response)) {
        response.redirect('/member/login');
        return;
    }
    const input = request.body;
    const inputTitle = input.title;
    const inputDescription = input.description;
    db.getConnection((err, conn) => {
        if (err) {
            conn.release();
            response.send('sql 실패');
            throw err;
        }
        else {
            const sql = 'insert into topic (title, description, User_id) values (?,?,?)';
            conn.query(sql, [inputTitle, inputDescription, request.session.nickname], (err2, result) => {
                if (err2) {
                    conn.release();
                    response.send('sql 실패');
                    throw err2;
                }
                response.redirect(`/topic/${result.insertId}`);
            });
        }
        conn.release();
    });
});

router.get('/update/:pageId', (request, response) => {
    if (!member.isOwner(request, response)) {
        response.redirect('/member/login');
        return;
    }
    db.getConnection((err, conn) => {
        if (err) {
            conn.release();
            response.send('db 연결에 실패하였습니다.');
            throw err;
        }
        const paramId = request.params.pageId;

        conn.query(`select * from topic where idx=?`, [paramId], (err2, result) => {
            if (err2) {
                conn.release();
                response.send('db 연결에 실패하였습니다.');
                throw err2;
            }
            if (request.session.nickname === result[0].User_id) {
                const title = result[0].title;
                const description = result[0].description;
                const view = template.HTML(form.updateTopic(title, description, paramId), member.statusUI(request, response));
                response.send(view);
            } else {
                response.redirect('/');
            }
        })
    })

})

router.post('/update/:pageId', (request, response) => {
    const input = request.body;
    const inputTitle = input.title;
    const inputDescription = input.description;
    const paramId = request.params.pageId;

    db.getConnection((err, conn) => {
        if (err) {
            conn.release();
            response.send('db 연결에 실패하였습니다.');
            throw err;
        }
        else {
            const sql = 'update topic set title=?, description=? where idx=?';
            conn.query(sql, [inputTitle, inputDescription, paramId], (err2, result) => {
                if (err2) {
                    conn.release();
                    response.send('db 연결에 실패하였습니다.');
                    throw err2;
                }
                conn.release();
                response.redirect(`/topic/${paramId}`);
            });
        }
    });
});

router.post('/delete', (request, response) => {
    if (!member.isOwner(request, response)) {
        response.redirect('/');
        return false;
    }
    const post = request.body;

    db.query(`DELETE FROM topic WHERE idx=?`, [post.id], (error, result) => {
        if (error) throw error;
        response.redirect('/');
    });
});

router.get('/:pageId', (request, response) => {
    const id = request.params.pageId;
    db.getConnection((err, conn) => {
        if (err) {
            conn.release();
            response.send('db 연결에 실패하였습니다.');
            throw err;
        }
        else {
            const sql = 'select * from topic where idx=?;';
            conn.query(sql, [id], (err2, result) => {
                if (err2) {
                    conn.release();
                    response.send('sql 실패');
                    throw err2;
                }
                else {
                    let update_delete = '';
                    if (result.length) {
                        if (member.isOwner(request, response) && request.session.nickname === result[0].User_id) {
                            update_delete = ` | <h5><ul><li><a href="/topic/update/${result[0].idx}">수정</a></li>
                                <li>
                                <form action="/topic/delete" method="post">
                                    <input type="hidden" name="id" value="${result[0].idx}">
                                    <input type="submit" value="삭제">
                                </form>
                                </li></ul>
                                </h5>`;
                        }
                        conn.release();
                        const topicView = template.topicView(result[0], update_delete);
                        response.send(template.HTML(topicView, member.statusUI(request, response)));
                    }
                    else {
                        conn.release();
                        response.send(template.HTML('존재하지 않는 페이지입니다~!'));
                    }
                }
            });
        }
    });
});

module.exports = router;