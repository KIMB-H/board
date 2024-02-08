const express = require('express');
const router = express.Router();
const template = require('../views/template.js');
const form = require('../views/form.js');
const db = require('../lib/db.js');
const member = require('../lib/member.js');

router.get('/login', (request, response) => {
    if (member.isOwner(request, response)) {
        response.redirect('/');
    } else {
        const loginForm = form.login;
        const view = template.HTML(loginForm);
        response.send(view);
    }
});

router.post('/login_process', (request, response) => {
    const input = request.body;
    const inputId = input.id;
    const inputPassword = input.password;

    db.getConnection((err, conn) => {
        if (err) {
            conn.release();
            response.send('db 연결에 실패하였습니다.');
            throw err;
        }
        else {
            const sql = 'select * from user where id=? and pw=?';
            conn.query(sql, [inputId, inputPassword], (err2, result) => {
                if (err2) {
                    conn.release();
                    response.send('db 연결에 실패하였습니다.');
                    throw err2;
                }
                conn.release();
                if (result.length) {
                    request.session.is_logined = true;
                    request.session.nickname = inputId;
                    request.session.save(() => {
                        response.redirect('/');
                    });
                }
                else response.redirect('/member/login');
            });
        }
    });
});

router.get('/signup', (request, response) => {
    if (member.isOwner(request, response)) {
        response.redirect('/');
    } else {
        const signupForm = form.signup;
        const view = template.HTML(signupForm);
        response.send(view);
    }
});

router.post('/signup_process', (request, response) => {
    const input = request.body;
    const inputId = input.id;
    const inputPw = input.password;
    const inputPwChk = input.password_check;
    const inputEmail = input.email;

    db.getConnection((err, conn) => {
        if (err) {
            conn.release();
            response.send('db 연결에 실패하였습니다.');
            throw err;
        }
        else {
            //수정사항
            //비밀번호 맞는지 체크
            //아이디 중복 아닌지 체크
            //같은 이메일 없는지 체크
            //이메일이 제대로 되어 있는지 확인 (gmail.com, naver.com 등)
            const sql = 'insert into user (id, pw, email) values (?, ?, ?);';
            conn.query(sql, [inputId, inputPw, inputEmail], (err2, result) => {
                if (err2) {
                    conn.release();
                    response.send('db 연결에 실패하였습니다.');
                    throw err2;
                }

                //수정사항 : 로그인 진행하라고 알림창 띄우기
                response.redirect('/member/login');
            });
        }
        conn.release();
    });
});

router.get('/logout', (request, response) => {
    request.session.destroy(() => {
        response.redirect('/');
    });
});

router.post('/delete', (request, response) => {
    //수정사항 : 삭제하기 전 정말 회원탈퇴 할 것인지 다시 물어보기
    const post = request.body;
    if (request.session) {
        if (request.session.nickname === post.id) {
            db.getConnection((err, conn) => {
                if (err) {
                    conn.release();
                    response.send('db 연결에 실패하였습니다.');
                    throw err;
                }
                conn.query(`delete from user where id=?`, [post.id], (err2, result) => {
                    if (err2) {
                        conn.release();
                        response.send('db 연결에 실패하였습니다.');
                        throw err2;
                    }
                    conn.release();
                    response.redirect('/member/logout'); //회원탈퇴하면 로그아웃
                });
            })
        }
        else {
            response.redirect('/');
        }
    }
    else {
        response.redirect('/');
    }
})

router.get('/update/:id', (request, response) => {
    const id = request.params.id;
    if (request.session.is_logined) {
        if (request.session.nickname === id) {
            const updateForm = form.updateMember(request);
            const view = template.HTML(updateForm, member.statusUI(request, response));
            response.send(view);
        } else {
            response.send(template.HTML('접근할 수 없는 영역입니다.', member.statusUI(request, response)));
        }
    } else {
        response.redirect('/member/login');
    }
});

router.post('/update_process', (request, response) => {
    const input = request.body;
    const inputPw = input.pw;
    const inputEmail = input.email;
    const sql = `update user set pw=?, email=? where id=?`;
    db.getConnection((err, conn) => {
        if (err) {
            conn.release();
            response.send('db 연결에 실패하였습니다.');
            throw err;
        }
        conn.query(sql, [inputPw, inputEmail, request.session.nickname], (err2, result) => {
            if (err2) {
                conn.release();
                response.send('db 연결에 실패하였습니다.');
                throw err2;
            }
            conn.release();
            response.redirect(`/member/${request.session.nickname}`);
        });
    });
});

router.get('/:id', (request, response) => {
    const id = request.params.id;

    if (request.session.is_logined) {
        if (request.session.nickname === id) {
            const view = template.HTML(`
                    <ul>
                        <li><a href="/topic/create">글 작성</a></li>
                        <li><a href="/author/${request.session.nickname}">작성한 글 목록</a></li>
                        <li><a href="/member/update/${id}">회원정보 수정</a></li>
                        <li><a href="/member/logout">로그아웃</a></li>
                        <li>
                        <form action="/member/delete" method="post">
                            <input type="hidden" name="id" value="${request.session.nickname}">
                            <button type="submit">회원탈퇴</button>
                        </form>
                        </li>
                    </ul>
            `, member.statusUI(request, response));
            response.send(view);
        } else {
            response.send(template.HTML('접근할 수 없는 영역입니다.', member.statusUI(request, response)));
        }
    } else {
        response.redirect('/member/login');
    }
})

module.exports = router;