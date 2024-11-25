import "./Avatar.css"

const Avatar = ({ username }) => {
    const getInitials = (name) => {
      const parts = name.split(" ");
      const initials = parts.map((part) => part[0]).join("").toUpperCase();
      return initials.length > 2 ? initials.slice(0, 2) : initials;
    };
  
    const generateRandomColor = () => {
      const colors = ["#555555"];
      return colors[Math.floor(Math.random() * colors.length)];
    };
  
    return (
      <div
        className="avatar-initials"
        style={{
          backgroundColor:generateRandomColor(),
        }}
      >
        {getInitials(username)}
      </div>
    );
  };

export default Avatar;