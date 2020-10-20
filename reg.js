module.exports = function () {


    const pg = require("pg");
    const Pool = pg.Pool;
    const connectionString = process.env.DATABASE_URL || 'postgresql://kagiso:123@localhost:5432/registrations';
    const pool = new Pool({
        connectionString
    });


    //adds to db
    async function addReg(regNumb) {

        if (!regNumb == "") {//if input is not empty
            var tested = /C[AYJ] \d{3,6}$/.test(regNumb)

            if (tested) {
                //splitting reg into code and number 
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

    async function filterReg(town) {
        if (town === "all") {
            const filtering = await pool.query(`select reg_numb from reg`)
            return filtering.rows
        }
        else {
         const others = await pool.query(`select * from reg where town_id = $1`, [town])
         return others.rows
        }
    }

    async function allReg() {
        const regs = await pool.query('select reg_numb from reg');
        return regs.rows;
    }

    async function clear() {
        const clear = await pool.query('delete from reg');
        return clear.rows
    }
    return {
        addReg,
        filterReg,
        allReg,
        clear
    }
}

