from CTFd import create_app
import netsos_config

app = create_app()
app.run(debug=True, threaded=True, host="0.0.0.0", port=netsos_config.Config.GROUND_PORT)
