let usersDB = [];
let idList  = new Set();

const NAME_MIN_LENGTH  = 3;
      MIN_AGE          = 16;
      MAX_AGE          = 65;
      POSSIBLE_GENDERS = ["M", "F"];

class User {
  static getUser(id) {
    const foundUser = usersDB.find((user) => user._id === id);
    if(!foundUser) 
      throw ["can not find user with that id"];
    else
      return foundUser;
  }

  static updateUser(id, params) {
    let user = User.getUser(id);

    user.buildUser({...user, ...params});
    user.save();

    return user;
  }

  static deleteUser(id) {
    const orignalLength = usersDB.length;

    usersDB = usersDB.filter((user) => user._id !== id);
    if(orignalLength === usersDB.length)
      throw ["can not find user with that id"];
  }

  static all() {
    return usersDB;
  }

  static sanitizeName(name) {
    return name ? name.replace(/\s+/g,' ').trim() : name;
  }

  constructor(params) {
    this.buildUser(params);
    this.save(true);
  }

  buildUser({name, age, gender}) {
    name   = User.sanitizeName(name);
    gender = gender ? gender.toUpperCase() : gender;
    // Note: validation has to come before setting the new params!
    this.errors  = [];
    this.validateName(name);
    this.validateAge(age);
    this.validateGender(gender);
    this.validate();

    this.name   = name
    this.age    = age;
    this.gender = gender;
  }

  validateName(name) {
    if(!/^[A-Za-z\s]+$/.test(name))
      this.errors.push("Name should only contain letters");

    if(!name || name.length < NAME_MIN_LENGTH)
      this.errors.push(`Name length has to be more than or equal to ${NAME_MIN_LENGTH}`);
  }

  validateAge(age) {
    if(isNaN(age)){
      this.errors.push("Age must be a number");
      return; // return here because rest of validations are on numbers!;
    }

    if (age < MIN_AGE || age > MAX_AGE)
      this.errors.push(`Age must be between ${MIN_AGE} and ${MAX_AGE}`);
  }

  validateGender(gender) {
    if (!POSSIBLE_GENDERS.includes(gender))
      this.errors.push(`Gender must be either ${POSSIBLE_GENDERS.join(" or ")}`);
  }

  validate() {
    const errors = [...this.errors];
    delete this.errors;
    if(errors.length) {
      throw errors;
    } 
  }

  generateID() {
    let id = null;
    do {
      id = `_${Math.random().toString(36).substr(2, 9)}`;
    } while (idList.has(id));

    return id;
  }

  save(isNew = false) {
    this.updated_at = new Date();
    if(isNew) {
      this.created_at = this.updated_at;
      this._id        = this.generateID();
      usersDB.push(this);
      idList.add(this._id);
    }
  }
}

module.exports.User    = User;