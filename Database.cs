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
            createTable.Execute();
            insert.Bind("val", "0").Execute();
            insert.Bind("val", "1").Execute();
            insert.Bind("val", "2").Execute();
        }
    }

    private static readonly Query createTable = new Query("CREATE TABLE test (id INTEGER PRIMARY KEY);", 0, false);
    private static readonly Query insert = new Query("INSERT INTO test (id) VALUES ($val);", 1, false);

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