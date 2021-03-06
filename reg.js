module.exports = function (pool) {


    //adds to db
    async function addReg(regNumb) {

        if (!regNumb == "") {//if input is not empty

            if (/C[AYJ] \d{3,6}$/.test(regNumb) || /C[AYJ] \d{3}-\d{3}$/.test(regNumb)) {
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
                } else {
                    return false
                }

            }
            else {
                return false
            }
        }
    }

    async function filterReg(town) {
        if (town === 'all') {
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
    async function regExists(regNumb) {

        const checking = await pool.query(`select * from reg where reg_numb = $1`, [regNumb])
        return checking.rowCount
    }
    return {
        addReg,
        filterReg,
        allReg,
        clear,
        regExists
    }
}