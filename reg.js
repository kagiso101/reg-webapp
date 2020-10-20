module.exports = function () {


    const pg = require("pg");
    const Pool = pg.Pool;
    const connectionString = process.env.DATABASE_URL || 'postgresql://kagiso:123@localhost:5432/registrations';
    const pool = new Pool({
        connectionString
    });


    //adds to db
    async function add(regNumb) {

        if (!regNumb == "") {//if input is not empty
            var tested = /C[AYJ] \d{3,6}$/.test(regNumb)

            if (tested) {
                const code = regNumb.substring(0, 2)
                const theId = await pool.query(`select id from towns where code = $1`, [code])
                const id = theId.rows[0].id

                let checking
                if (id > 0) {
                    checking = await pool.query(`select * from reg where reg_numb = $1`, [regNumb])
                } else {
                    return false
                }

                if (checking.rowCount === 0) {
                    await pool.query(`insert into reg (reg_numb, town_id) values ($1, $2)`, [regNumb, id])
                }
            }
        }
    }

    async function addReg(registrations) {
        let data = [
            registrations.reg_numb,
            registrations.town_id
        ];
        return pool.query(`insert into reg(reg_numb, town_id) 
                    values ($1, $2)`, data);
    }

    async function allReg() {
        const regs = await pool.query('select reg_numb from reg');
        return regs.rows;
    }
    async function clear() {
        const clear = await pool.query('delete from reg');
    }
    return {
        add,
        addReg,
        allReg,
        clear
    }
}

