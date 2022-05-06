using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

/// <summary>
/// Class representing the configuration data structure
/// </summary>
public class ConfigStruct {
    public MatchConfig match;
    public List<string> metrics = new List<string>();

    public struct MatchConfig {
        public int allianceSize;
    } 
}

/// <summary>
/// Singleton class storing the current configuration
/// </summary>
public class Config : ConfigStruct {

    /** Private copy of singleton instance */
    private static readonly Config _instance = new Config("config.yml");
    /** Singleton instance */
    public static Config instance {get {return _instance;} }

    private Config(string path) {
        var deserializer = new DeserializerBuilder()
            .WithNamingConvention(CamelCaseNamingConvention.Instance)
            .Build();

        var cfg = deserializer.Deserialize<ConfigStruct>(File.ReadAllText(path));
        // Copy fields
        this.match = cfg.match;
        this.metrics = cfg.metrics;
    }

}
