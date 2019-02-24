
export class Contact {

    public email: string;
    public name: string;
    public message: string;
    public date: string;

    constructor(email: string, name: string, message: string) {
        this.email = email;
        this.name = name;
        this.message = message;
        
        this.date = this.getDate();
        
    }

    getDate() {

        var date = new Date(),
          year = date.getFullYear(),
          month = (date.getMonth() + 1).toString(),
          formatedMonth = (month.length === 1) ? ("0" + month) : month,
          day = date.getDate().toString(),
          formatedDay = (day.length === 1) ? ("0" + day) : day,
          hour = date.getHours().toString(),
          formatedHour = (hour.length === 1) ? ("0" + hour) : hour,
          minute = date.getMinutes().toString(),
          formatedMinute = (minute.length === 1) ? ("0" + minute) : minute,
          second = date.getSeconds().toString(),
          formatedSecond = (second.length === 1) ? ("0" + second) : second;
          
          return formatedDay + "/" + formatedMonth + "/" + year + " " + formatedHour + ':' + formatedMinute + ':' + formatedSecond;
      }

}