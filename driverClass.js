//rajtszám;keresztnév;vezetéknév;születési év;csapat;szezon győzelem odds;

class Driver {
    constructor(row){
        const splitted = row.split(";");
        this.raceNumber = splitted[0];
        this.firstName = splitted[1];
        this.lastName = splitted[2];
        this.birthYear = splitted[3];
        this.team = splitted[4];
        this.seasonOdds = Number(splitted[5]);
        this.nationality = splitted[6];
    }

    static LoadData(driverdata){
        let drivers = [];
        driverdata.forEach(row => {
            drivers.push(new Driver(row));
        });
        return drivers;
    }
}

export { Driver };