import { supabase } from "./supabase";

/**
 * Initialize all required database tables and policies
 * Run this once to set up the database schema
 */
export async function initializeDatabaseSchema() {
  try {
    console.log("🔄 Initializing database schema...");

    // Note: Table creation via RPC is complex. Instead, use Supabase SQL Editor.
    // These helper functions provide alternative approaches.
    
    console.log("✅ Database schema initialization prepared!");
    console.log("⚠️  To complete setup, run SQL in Supabase SQL Editor");
    console.log("📋 See COMPLETE_DATABASE_SETUP.md for all SQL commands");
    
    return { success: true };
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    return { success: false, error };
  }
}

/**
 * Initialize sample products in the database
 */
export async function initializeSampleProducts() {
  try {
    console.log("🔄 Initializing sample products...");

    const { error } = await supabase
      .from("products")
      .insert([
        {
          name: "Noir Derby",
          price: 14999,
          color: "Black",
          category: "Derby",
          description:
            "Handcrafted from the finest Italian calfskin leather. The Noir Derby features a classic cap-toe design with Goodyear welt construction for unmatched durability and elegance.",
          is_active: true,
        },
        {
          name: "Cognac Brogue",
          price: 18999,
          color: "Cognac",
          category: "Brogue",
          description:
            "A masterpiece of traditional British shoemaking. Full brogue wingtip detailing on rich cognac leather, hand-burnished for a museum-quality finish.",
          is_active: true,
        },
        {
          name: "Oxblood Monk",
          price: 21999,
          color: "Burgundy",
          category: "Monk Strap",
          description:
            "Double monk strap in deep oxblood burgundy. Hand-polished brass buckles and a sleek silhouette make this a boardroom essential.",
          is_active: true,
        },
        {
          name: "Chelsea Bordeaux",
          price: 16999,
          color: "Brown",
          category: "Chelsea Boot",
          description:
            "The ultimate statement boot. Premium pull-up leather in dark bordeaux with elastic side panels and a refined slim profile.",
          is_active: true,
        },
        {
          name: "Midnight Loafer",
          price: 13999,
          color: "Navy",
          category: "Loafer",
          description:
            "Effortless Italian sophistication. Deep midnight leather penny loafer with hand-stitched apron and butter-soft calfskin lining.",
          is_active: true,
        },
        {
          name: "Sahara Chukka",
          price: 15999,
          color: "Tan",
          category: "Chukka Boot",
          description:
            "Desert-inspired elegance in premium suede. The Sahara Chukka features a two-eyelet design, leather sole, and a silhouette that bridges casual and formal.",
          is_active: true,
        },
      ]);

    if (error && !error.message.includes("duplicate")) {
      throw error;
    }

    console.log("✅ Sample products initialized!");
    return { success: true };
  } catch (error) {
    console.error("❌ Sample products initialization failed:", error);
    return { success: false, error };
  }
}

/**
 * Get product statistics including storage usage
 */
export async function getProductStatistics() {
  try {
    const { data, error } = await supabase.from("products").select("*");

    if (error) throw error;

    const { data: storageData, error: storageError } = await supabase
      .from("storage_metadata")
      .select("file_size_bytes");

    if (storageError) throw storageError;

    const totalSize = (storageData || []).reduce(
      (sum, item) => sum + (item.file_size_bytes || 0),
      0
    );

    return {
      totalProducts: data?.length || 0,
      totalStorageBytes: totalSize,
      totalStorageMB: Number((totalSize / (1024 * 1024)).toFixed(2)),
      imagesCount: storageData?.length || 0,
    };
  } catch (error) {
    console.error("Failed to get statistics:", error);
    return {
      totalProducts: 0,
      totalStorageBytes: 0,
      totalStorageMB: 0,
      imagesCount: 0,
    };
  }
}

/**
 * Create storage bucket if it doesn't exist
 * Note: This might not work via client SDK - may need to be done in Supabase dashboard
 */
export async function ensureStorageBucket() {
  try {
    console.log("🔄 Checking storage bucket...");

    // Try to get bucket info
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (!listError && buckets) {
      const productBucketExists = buckets.some(
        (b) => b.name === "product-images"
      );

      if (productBucketExists) {
        console.log("✅ Storage bucket exists!");
        return { success: true, exists: true };
      }
    }

    console.log(
      "⚠️  Storage bucket 'product-images' not found. Please create it manually in Supabase dashboard."
    );
    return {
      success: false,
      message:
        "Create bucket 'product-images' in Supabase dashboard > Storage > New Bucket",
    };
  } catch (error) {
    console.error("Bucket check failed:", error);
    return { success: false, error };
  }
}

/**
 * Verify database is properly set up
 */
export async function verifyDatabaseSetup(): Promise<{
  ready: boolean;
  checks: {
    productsTable: boolean;
    storageMetadata: boolean;
    storageBucket: boolean;
    sampleProducts: boolean;
  };
}> {
  const checks = {
    productsTable: false,
    storageMetadata: false,
    storageBucket: false,
    sampleProducts: false,
  };

  try {
    // Check products table
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select("count()")
      .limit(1);

    checks.productsTable = !productsError;

    // Check storage metadata table
    const { error: metadataError } = await supabase
      .from("storage_metadata")
      .select("count()")
      .limit(1);

    checks.storageMetadata = !metadataError;

    // Check storage bucket
    const { data: buckets } = await supabase.storage.listBuckets();
    checks.storageBucket = !!(buckets && buckets.some((b) => b.name === "product-images"));

    // Check sample products exist
    const { data: products } = await supabase
      .from("products")
      .select("count()", { count: "exact" });

    checks.sampleProducts = (products?.length || 0) > 0;
  } catch (error) {
    console.error("Verification failed:", error);
  }

  return {
    ready: checks.productsTable && checks.storageMetadata && checks.storageBucket,
    checks,
  };
}
