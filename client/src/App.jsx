//Useful Links:
//https://fantasy.premierleague.com/api/element-summary/263/

//BUG
//Problem with data in variables when strict mode on fix

//TODO
//Display money used to create your team
//Clean up UI and make more responsive

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MakeTeam from "./pages/makeTeam/MakeTeam";
import DreamTeam from "./pages/DreamTeam";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Loading from "./components/Loading";

export default function App() {
  const [playerData, setPlayerData] = useState({});

  const proxyUrl = "https://api.allorigins.win/raw?url=";
  const apiUrl = "https://fantasy.premierleague.com/api/bootstrap-static/";
  const fetch_limit = "?_limit=10";

  //key is player id
  let ap = [];
  let apSorted = [];
  //key is player position
  let pp = {};
  //key is team name
  let pt = {};
  //array of player id
  let dt = [];
  function parseAllPlayers({
    fetchedPlayers,
    fetchedTeams,
    fetchedPlayerTypes,
  }) {
    ap = [];
    apSorted = [];
    pp = {};
    pt = {};
    dt = [];
    fetchedPlayers.forEach((p) => {
      let player = {
        id: p.id,
        fname: p.first_name,
        sname: p.second_name,
        points: p.total_points,
        team: fetchedTeams[p.team - 1].name,
        web_name: p.web_name,
        position: fetchedPlayerTypes[p.element_type - 1].singular_name,
        in_dreamteam: p.in_dreamteam,
        price: (p.now_cost / 10).toFixed(1),
        photo: `https://resources.premierleague.com/premierleague/photos/players/250x250/p${p.photo.slice(
          0,
          -4
        )}.png`,
      };

      apSorted = apSorted.concat([player]);
      ap[`${p.id}`] = player;
    });
    apSorted.sort((a, b) => b.points - a.points);
  }

  function parseData(apSorted) {
    pp = {};
    pt = {};
    dt = [];
    apSorted.forEach((p) => {
      const teamName = p.team;
      pt[`${teamName}`]
        ? (pt[`${teamName}`] = pt[`${teamName}`].concat(p))
        : (pt[`${teamName}`] = [p]);

      if (p.in_dreamteam) {
        dt = dt.concat([p]);
      }

      const position = p.position + "s";
      pp[`${position}`]
        ? (pp[`${position}`] = pp[`${position}`].concat(p))
        : (pp[`${position}`] = [p]);
    });
  }

  useEffect(() => {
    fetch("http://localhost:5000/api")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        parseAllPlayers({
          fetchedPlayers: data.elements,
          fetchedTeams: data.teams,
          fetchedPlayerTypes: data.element_types,
        });

        parseData(apSorted);
        setPlayerData({
          allPlayers: ap,
          allPlayersSorted: apSorted,
          dreamTeam: dt,
          playerPositions: pp,
          playerTeam: pt,
        });
      })
      .catch((e) => {
        console.log(`The following error was caught:`);
        throw e;
      });
  }, []);
  return (
    <>
      {playerData.allPlayers ? (
        <BrowserRouter>
          <Navbar>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/dreamteam"
                element={<DreamTeam dreamTeam={playerData.dreamTeam} />}
              />
              <Route
                path="/maketeam"
                element={
                  <MakeTeam
                    allPlayers={playerData.allPlayers}
                    allPlayersSorted={playerData.allPlayersSorted}
                    playerPositions={playerData.playerPositions}
                    playerTeam={playerData.playerTeam}
                  />
                }
              />
              {/* <Route path="/login" element={<Login />} /> */}
            </Routes>
          </Navbar>
        </BrowserRouter>
      ) : (
        (() => {
          // console.log(playerData)
          return <Loading />;
        })()
      )}
    </>
  );
}
