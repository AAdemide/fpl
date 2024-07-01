export default function Navbar(props) {
  const links = [
    <a href="/">Home</a>,
    <a href="/dreamteam">Dream Team</a>,
    <a href="/maketeam">Make Team</a>,
    // <a href="/login">Login</a>,
  ];
  return (
    <div className="navbar-home">
      <div className="navbar">
        <ul className="navbar-links">
          {links.map((link, i) => {
            return <li key={i}>{link}</li>;
          })}
        </ul>
      </div>
      <div className="navbar-pages">
        {props.children}
      </div>   
    </div>
  );
}
