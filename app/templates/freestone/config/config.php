<?PHP
	

    //ID of that client
    VEnv::$client = '<%= props.projectNamespace %>';
    VEnv::$siteName = '<%= props.projectName %>';
	
	VEnv::addEnv('local', array('.freestone2'), array(
		 //database config
		'dbUser' => 'root',
		'dbPass' => '',
		'dbName' => '<%= props.dbName %>',
		'cacheConfig' => array(
			'life' => 10,
			'noCacheVars' => false,
		),
		'isDev' => true,
	));
	
	VEnv::addEnv('bobette', array('.freestone'), array(
		 //database config
		'dbUser' => 'remote',
		'dbPass' => 'remote',
		'dbServer' => '192.168.1.199',
		'dbName' => '<%= props.dbName %>',
		'cacheConfig' => array(
			'life' => 10,
			'noCacheVars' => false,
		),
		'isDev' => true,
	));
	

	
	//array of css to display in html fields of the admin
    VEnv::$pathCss = array();
    
	//indicate if we rewrite addresses for this website's pages.
	VEnv::$doRewrite = true;
	
	VEnv::$defaultID = 1;
	VEnv::$defaultLang = 'fr';
	VEnv::$defaultTable = 'page';
	
	VEnv::$salt = '<%= props.salt %>';
	
	//this field's value is appended to table name to get template file
	VEnv::$fieldBasedTplNames['page'] = 'template';
	
	VEnv::$cacheConfig = array(
		'life' => 86000,
		'noCacheVars' => false,
	);
	
	

