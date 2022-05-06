using Microsoft.Data.Sqlite;

public class Database {

    /** Private copy of singleton instance */
    private static readonly Database _instance = new Database();
    /** Singleton instance */
    public static Database instance {get {return _instance;} }
    private Database() {}

    /** Database connection to be used */
    private SqliteConnection connection = new SqliteConnection();

    public void Init(string file){
        connection.ConnectionString = $"Data Source={file}";
        var init = !File.Exists(file);
        connection.Open();
        if(init){
            Console.WriteLine("Creating database");
            // Create tables
            new Query(@"
                CREATE TABLE Team (
                    number      INTEGER PRIMARY KEY,
                    name        VARCHAR(128)
                );", 0, false).Execute();

            string matchTeams = "";
            string matchFKs = "";
            // Procedurally build table for match data
            for(int i=0; i<3; i++){
                string nullability = i < Config.instance.match.allianceSize ? "NOT NULL" : "";
                matchTeams += @$"
                    red{i} INTEGER {nullability},
                    blue{i} INTEGER {nullability},";
                matchFKs += @$"
                    FOREIGN KEY (red{i}) REFERENCES Team(number) ON UPDATE CASCADE ON DELETE RESTRICT,
                    FOREIGN KEY (blue{i}) REFERENCES Team(number) ON UPDATE CASCADE ON DELETE RESTRICT,";
            }
            // Remove trailing command and end statement
            new Query(@$"
                CREATE TABLE Match (
                    id          INTEGER PRIMARY KEY AUTOINCREMENT,
                    type        VARCHAR(16) NOT NULL,
                    number      INTEGER NOT NULL,
                    {matchTeams}
                    {matchFKs.Remove(matchFKs.Length-1)}
                );", 0, false).Execute();

            // Procedurally build table for match score
            string scoreMetrics = "";
            foreach(var m in Config.instance.metrics) {
                scoreMetrics += @$"
                    red{m} INTEGER NOT NULL,
                    blue{m} INTEGER NOT NULL,";
            }
            new Query(@$"
                CREATE TABLE MatchScore (
                    match INTEGER PRIMARY KEY,
                    {scoreMetrics}

                    FOREIGN KEY (match) REFERENCES Match(id) ON UPDATE CASCADE ON DELETE RESTRICT
                );", 0, false).Execute();
        }
    }

    class Query {
        private readonly SqliteCommand Command = Database.instance.connection.CreateCommand();
        public int NumParameters {get; private set;}
        public bool HasResult {get; private set;}
        public Query(string queryString, int numParameters, bool hasResult){
            Command.CommandText = queryString;

            NumParameters = numParameters;
            HasResult = hasResult;
        }

        public Query Bind(string key, string val) {
            Command.Parameters.AddWithValue(key, val);
            return this;
        }

        public Query Bind(Dictionary<string, string> parameters){
            foreach(KeyValuePair<string, string> entry in parameters) {
                Bind(entry.Key, entry.Value);
            }
            return this;
        }

        public SqliteDataReader? Execute(){
            if(Command.Parameters.Count != NumParameters) {
                throw new InvalidOperationException($"Command {Command.CommandText} has incorrect number of bound parameters: {Command.Parameters.Count}/{NumParameters}");
            }            
            SqliteDataReader? result = null;
            if(HasResult) {
                result = Command.ExecuteReader();
            } else {
                Command.ExecuteNonQuery();
            }
            Command.Parameters.Clear();
            return result;
        }
    }
}