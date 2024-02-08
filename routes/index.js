const express = require('express');
const router = express.Router();
const template = require('../views/template.js');
const db = require('../lib/db.js');
const member = require('../lib/member.js');

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
                    response.send('db 연결에 실패하였습니다.');
                    throw err2;
                }
                else
                    body += template.authorList(result);
            });

            conn.query(sql, (err2, result) => {
                if (err2) {
                    conn.release();
                    response.send('db 연결에 실패하였습니다.');
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

module.exports = router;