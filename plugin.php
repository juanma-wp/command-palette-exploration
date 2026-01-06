<?php
/**
 * Plugin Name: Command Palette Exploration
 * Plugin URI: https:// example.com/my-custom-plugin
 * Description: A custom WordPress plugin .
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https:// example.com
 * License: GPL2
 */

add_action( 'admin_init', 'command_api_exploration_editor_assets', 9999 );

/**
 * Enqueue the script from build folder.
 */
function command_api_exploration_editor_assets() {
	$asset_file = trailingslashit( __DIR__ ) . 'build/index.asset.php';

	if ( file_exists( $asset_file ) ) {
		$asset = include $asset_file;

		wp_enqueue_script(
			'command-api-exploration',
			trailingslashit( plugin_dir_url( __FILE__ ) ) . 'build/index.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);
	}
}
