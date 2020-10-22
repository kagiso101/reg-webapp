let assert = require('assert')
let Reg = require('../reg')


const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://kagiso:123@localhost:5432/registrations2';
const pool = new Pool({
    connectionString
});

const reg = Reg(pool)

describe("The Registration function", function () {


    beforeEach(async function () {
        await pool.query(`delete from reg`)
    });


    it("should be able to add registration to the database", async function () {
        const reg = Reg(pool)

        var number = 'CA 1234'

        await reg.addReg(number)


        assert.deepEqual([{ reg_numb: 'CA 1234' }], await reg.allReg());
    });

    it("should be able to add multiple registrations to the database", async function () {
        const reg = Reg(pool)

        const number2 = 'CJ 123456';
        const number3 = "CY 2345";
        const number4 = "CA 876-568";

        await reg.addReg(number2)
        await reg.addReg(number3)
        await reg.addReg(number4)
        const allReg = await reg.allReg()

        assert.deepEqual([{ reg_numb: "CJ 123456" }], [{ reg_numb: 'CJ 123456' }], [{ reg_numb: 'CY 2345' }], [{ reg_numb: 'CA 876-568' }], allReg);
    });

    it("should be able to filter for Cape Town ", async function () {
        const reg = Reg(pool)

        await reg.addReg("CJ 12345")
        await reg.addReg("CA 12345")

        assert.deepEqual([{ reg_numb: "CA 1234" }],[{ reg_numb: "CA 1234" }],[{ reg_numb: "CA 12345" }], await reg.filterReg('1'));
    });

    it("should be able to filter for Paarl ", async function () {


        await reg.addReg("CJ 12345")
        await reg.addReg("CA 12345")

        assert.deepEqual([{ reg_numb: "CJ 123456" }],[{ reg_numb: "CJ 123456" }],[{ reg_numb: "CJ 12345" }], await reg.filterReg('2'));
    });

    it("should be able to filter for Bellville ", async function () {
        const reg = Reg(pool)


        await reg.addReg("CJ 12345")
        await reg.addReg("CY 12345")

        assert.deepEqual([{ reg_numb: "CY 2345" }],[{ reg_numb: "CY 2345" }], [{ reg_numb: "CY 12345" }], await reg.filterReg('3'));
    });


    it("should return all the reg numbers", async function () {
        const reg = Reg(pool)

        const number = "CA 1234";
        const number2 = "CJ 12345";
        const number3 = "CY 123456";

        await reg.addReg(number)
        await reg.addReg(number2)
        await reg.addReg(number3)


        assert.deepEqual([{ reg_numb: "CJ 12345" }], [{ reg_numb: "CJ 12345" }], [{ reg_numb: "CY 123456" }], await reg.allReg());
    });


    it("should be able to reset the dataBase", async function () {
        const reg = Reg(pool)

        await reg.addReg('CA 12345')
        await reg.addReg('CJ 1234')

        const allReg = await reg.allReg()

        assert.deepEqual([], await reg.clear());
    });

    after( async function () {
        pool.end();
    })
});
