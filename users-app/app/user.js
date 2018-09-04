let usersDB = [];
let idList  = new Set();

const NAME_MIN_LENGTH  = 3;
      MIN_AGE          = 16;
      MAX_AGE          = 65;
      POSSIBLE_GENDERS = ["M", "F"];

class User {
  static sanitizeName(name) {
    return name.replace(/\s+/g,' ').trim();
  }

  constructor({name, age, gender}) {
    this._id        = this.generateID();
    this.name       = User.sanitizeName(name);
    this.age        = age;
    this.gender     = gender.toUpperCase();
    this.created_at = new Date();
    this.updated_at = this.created_at;
    this.errors  = [];
    this.validateName();
    this.validateAge();
    this.validateGender();
    
    this.save();
  }

  generateID() {
    let id = null;
    do {
      id = `_${Math.random().toString(36).substr(2, 9)}`;
    } while (idList.has(id));

    return id;
  }

  setName(name) {
    this.name = User.sanitizeName(name);
  }

  setGender(gender) {
    this.gender = gender;
  }

  setGender(gender) {
    this.gender = gender;
  }

  validateName() {
    if(!/^[A-Za-z\s]+$/.test(this.name))
      this.errors.push("Name should only contain letters");

    if(this.name.length < NAME_MIN_LENGTH)
      this.errors.push(`Name length has to be more than or equal to ${NAME_MIN_LENGTH}`);
  }

  validateAge() {
    if(isNaN(this.age)){
      this.errors.push("Age must be a number");
      return; // return here because rest of validations are on numbers!;
    }

    if (this.age < MIN_AGE || this.age > MAX_AGE)
      this.errors.push(`Age must be between ${MIN_AGE} and ${MAX_AGE}`);
  }

  validateGender() {
    if (!POSSIBLE_GENDERS.includes(this.gender))
      this.errors.push(`Gender must be either ${POSSIBLE_GENDERS.join(" or ")}`);
  }

  save() {
    if(this.errors.length) {
      throw this.errors;
    } else {
      delete this.errors;
      usersDB.push(this);
      idList.add(this.id);
    }
  }
}

module.exports.User    = User
module.exports.usersDB = usersDB