interface Project {
  image: string;
  name: string;
  tech: string;
  type: string;
  description: string;
  link: string;
  priority: Number;
}

interface Skill {
  icon: string;
  name: string;
  description: string;
  proficiency: string;
}

interface User {
  username: string;
  email: string;
  password: string;
}

interface Message {
  username: string;
  email: string;
  message: string;
}

export { Project, Skill, User, Message };
