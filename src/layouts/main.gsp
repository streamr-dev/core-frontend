	<g:render template="/layouts/layoutHead"/>
	
    <body class="no-main-menu main-navbar-fixed ${pageProperty( name:'body.theme' ) ?: 'selected-theme'} ${pageProperty( name:'body.class' )}">

		<div id="main-wrapper">

			<g:render template="/layouts/topBanner"/>
	
			<div id="content-wrapper">
	        	<g:layoutBody />
	        </div>
        
        </div>
                
		<r:layoutResources/>
		<g:render template="/layouts/spinner"/>
    </body>
</html>
