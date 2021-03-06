<?php

namespace Drupal\serialization_test;

use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class SerializationTestNormalizer implements NormalizerInterface {

  /**
   * The format that this Normalizer supports.
   *
   * @var string
   */
  protected static $format = 'serialization_test';

  /**
   * {@inheritdoc}
   */
  public function normalize($object, $format = NULL, array $context = []): array|string|int|float|bool|\ArrayObject|NULL {
    $normalized = (array) $object;
    // Add identifying value that can be used to verify that the expected
    // normalizer was invoked.
    $normalized['normalized_by'] = 'SerializationTestNormalizer';
    return $normalized;
  }

  /**
   * Checks whether format is supported by this normalizer.
   *
   * @param mixed $data
   *   Data to normalize.
   * @param string $format
   *   Format the normalization result will be encoded as.
   *
   * @return bool
   *   Returns TRUE if the normalizer can handle the request.
   */
  public function supportsNormalization($data, $format = NULL): bool {
    return static::$format === $format;
  }

}
