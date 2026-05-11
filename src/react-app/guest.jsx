export default function Guest() {
    return (<>
        {/* <% if (auth) { %>
            <div id="data" style = "display: none;">
                {"user":{
                    "u_id":"<%=user.u_id%>",
                    "email":"<%=user.email%>",
                    "password":"<%=user.password%>"
                }}
            </div>
        <% } else {%> */}
            <div id="data" style = {{display: 'none'}}>
                {'{"name": "guest"}'}
                {/* {"name":"<%=name%>"} */}
            </div>
        {/* <% } %> */}

        <div id="loading">
            <div id="load-bar">
                <h1><i>Loading...</i></h1>
                <progress id="loadBar" value="0"></progress>
            </div>
        </div>

        <div id = "space-div">
            <canvas id = "map" width="180" height="180"></canvas>
            
            <div id = "l-board">
                <h2>players</h2>
                <hr/>
                <div id = "l-list"></div>
            </div>
            
            <div id = "chat">
                <div id = "chat-text" className = "chatText"></div>

                <form id = "chat-form" noValidate>
                    <input id = "chat-input" className = "chat" autoComplete = "off" type = "text"></input>
                
                    <button id = "send-button" className = "chat game-button">Send</button>
                    
                    <button id = "slide-button" className = "chat game-button" type="button">⇅</button>
                </form>
            </div>
        </div>

        <div id = "landed-div" style = {{display: 'none'}}>
            <div id = "alert"></div>
            <div className = "top">
                <div id = "money"></div>
                <b>Space Station</b>
            </div>

            <div className = "flex">
                <div className = "selected tab" id = "buyTab">BUY</div>
                <div className = "unselected tab" id = "sellTab">SELL</div>
                <div className = "unselected tab" id = "craftTab">CRAFT</div>
                <div className = "unselected tab" id = "equipmentTab">EQUIPMENT</div>
            </div>

            <div className = "interface" id = "buyDiv"><p>Space ships:</p></div>

            <div className = "interface" id = "sellDiv" style = {{display: 'none'}}>
                <div id = "sell-bottom">
                    <button id = "sellButton" className = "game-button" disabled>Sell</button>
                </div>
            </div>
            
            <div className = "interface" id = "craftDiv" style = {{display: 'none'}}>
                <div id = "crafting">
                    <table>
                        <tbody>
                            <tr><td><div className = "cell"></div></td><td><div className = "cell"></div></td><td><div className = "cell"></div></td></tr>
                            <tr><td><div className = "cell"></div></td><td><div className = "cell"></div></td><td><div className = "cell"></div></td></tr>
                            <tr><td><div className = "cell"></div></td><td><div className = "cell"></div></td><td><div className = "cell"></div></td></tr>
                        </tbody>
                    </table>

                    <button id = "convert" className = "game-button">⇩</button>
                    
                    <div id = "result" className = "cell"></div>
                </div>
            </div>

            <div className = "interface" id = "equipmentDiv" style = {{display: 'none'}}>
                <div id = "equipment" className = "inventory">
                    <div id = "ship-img"></div>
                    
                    <div id = "weapons" className = "equipment">
                    </div>

                    <div id = "engines" className = "equipment">
                    </div>

                    <div id = "other" className = "equipment">
                    </div>
                </div>

                <div id = "inventory" className = "inventory"></div>
            </div>
            
            <div className = "bottom">
                <button id = "take-off" className = "game-button">Take off</button>
            </div>

            <div id = "hand" className = "cell"></div>
        </div>
        <script src = "/client/game.min.js" async={true} />
    </>);
};
