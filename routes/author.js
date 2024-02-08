const express = require('express');
const router = express.Router();
const template = require('../views/template.js');
const db = require('../lib/db.js');
const member = require('../lib/member.js');

router.get('/', (request, response) => {
    db.getConnection((err, conn) => {
        if (err) {
            conn.release();
            response.send('db 연결에 실패하였습니다.');
            throw err;
        }
        else {
            const sql = 'select * from user;';
            conn.query(sql, (err2, result) => {
                if (err2) {
                    conn.release();
                    response.send('db 연결에 실패하였습니다.');
                    throw err2;
                }
                else {
                    const authorList = template.authorList(result);
                    const view = template.HTML(authorList, member.statusUI(request, response));
                    response.send(view);
                }
            })
        }
        conn.release();
        // response.send(view);
    });
})

router.get('/:userId', (request, response) => {
    const id = request.params.userId;
    db.getConnection((err, conn) => {
        if (err) {
            conn.release();
            response.send('db 연결에 실패하였습니다.');
            throw err;
        }
        else {
            const sql = 'select * from topic where User_id=?;';
            conn.query(sql, [id], (err2, result) => {
                if (err2) {
                    conn.release();
                    response.send('db 연결에 실패하였습니다.');
                    throw err2;
                }
                conn.release();

                const topicView = template.authorTopicsList(id, result);
                const view = template.HTML(topicView, member.statusUI(request, response));
                response.send(view);
            })
        }
    });
})

module.exports = router;