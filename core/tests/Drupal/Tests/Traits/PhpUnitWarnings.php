<?php

namespace Drupal\Tests\Traits;

/**
 * Converts deprecation warnings added by PHPUnit to silenced deprecations.
 *
 * This trait exists to allow Drupal to run tests with multiple versions of
 * PHPUnit without failing due to PHPUnit's deprecation warnings.
 *
 * @internal
 */
trait PhpUnitWarnings {

  /**
   * Deprecation warnings from PHPUnit to raise with @trigger_error().
   *
   * Add any PHPUnit deprecations that should be handled as deprecation warnings
   * (rather than unconditional failures) for core and contrib.
   *
   * @var string[]
   */
  private static $deprecationWarnings = [
    // Warning for testing.
    'Test warning for \Drupal\Tests\PhpUnitWarningsTest::testAddWarning()',
    // PHPUnit 9.
    'assertFileNotExists() is deprecated and will be removed in PHPUnit 10. Refactor your code to use assertFileDoesNotExist() instead.',
    'assertRegExp() is deprecated and will be removed in PHPUnit 10. Refactor your code to use assertMatchesRegularExpression() instead.',
    'assertNotRegExp() is deprecated and will be removed in PHPUnit 10. Refactor your code to use assertDoesNotMatchRegularExpression() instead.',
    'assertDirectoryNotExists() is deprecated and will be removed in PHPUnit 10. Refactor your code to use assertDirectoryDoesNotExist() instead.',
    'Support for using expectException() with PHPUnit\\Framework\\Error\\Warning is deprecated and will be removed in PHPUnit 10. Use expectWarning() instead.',
    'Support for using expectException() with PHPUnit\\Framework\\Error\\Error is deprecated and will be removed in PHPUnit 10. Use expectError() instead.',
    'assertDirectoryNotIsWritable() is deprecated and will be removed in PHPUnit 10. Refactor your code to use assertDirectoryIsNotWritable() instead.',
    'assertFileNotIsWritable() is deprecated and will be removed in PHPUnit 10. Refactor your code to use assertFileIsNotWritable() instead.',
    'The at() matcher has been deprecated. It will be removed in PHPUnit 10. Please refactor your test to not rely on the order in which methods are invoked.',
  ];

  /**
   * Converts PHPUnit deprecation warnings to E_USER_DEPRECATED.
   *
   * @param string $warning
   *   The warning message raised in tests.
   *
   * @see \PHPUnit\Framework\TestCase::addWarning()
   *
   * @internal
   */
  public function addWarning(string $warning): void {
    if (in_array($warning, self::$deprecationWarnings, TRUE)) {
      // Convert listed PHPUnit deprecations into E_USER_DEPRECATED and prevent
      // each from being raised as a test warning.
      @trigger_error($warning, E_USER_DEPRECATED);
      return;
    }

    // Otherwise, let the parent raise any warning not specifically listed.
    parent::addWarning($warning);
  }

}
