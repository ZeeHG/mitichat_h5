import squel from 'squel';
export function localUsers(db) {
    return db.exec(`
      create table if not exists 'local_users' (
            'user_id' varchar(64),
            'name' varchar(255),
            'face_url' varchar(255),
            'create_time' integer,
            'app_manger_level' integer,
            'ex' varchar(1024),
            'attached_info' varchar(1024),
            'global_recv_msg_opt' integer,
             primary key ('user_id')
        )
    `);
}
export function getLoginUser(db, userID) {
    return db.exec(`
        select *, name as nickname from local_users where user_id = '${userID}'  limit 1;
    `);
}
export function insertLoginUser(db, user) {
    const sql = squel.insert().into('local_users').setFields(user).toString();
    return db.exec(sql);
}
export function updateLoginUser(db, user) {
    const sql = squel
        .update()
        .table('local_users')
        .setFields(user)
        .where(`user_id = '${user.user_id}'`)
        .toString();
    return db.exec(sql);
}
