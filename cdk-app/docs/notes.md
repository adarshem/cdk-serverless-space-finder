# Important Notes

## 1. Understanding the `scope` Parameter in AWS CDK

In AWS CDK (and similar frameworks), the `scope` parameter in a construct's constructor defines **where this construct will live in the construct tree**.

---

### Why is `scope` needed?

- **Hierarchy:** Constructs are organized in a tree structure. The `scope` tells the construct who its parent is.
- **Resource Management:** This helps CDK manage resources, dependencies, and logical IDs.
- **Isolation:** It allows you to nest constructs, making your infrastructure modular and reusable.

---

### Example

```typescript
const apiStack = new ApiStack(app, 'ApiStack');
```