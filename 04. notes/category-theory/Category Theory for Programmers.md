# Category Theory for Programmers

> **Author**: Bartosz Milewski
> **Pages**: 498
> **Difficulty**: Beginner → Intermediate → Advanced
> **Primary Language**: Haskell
> **Secondary Languages**: C++, Scala
> **Estimated Study Time**: 80-120 hours

---

## Learning Paths

| Path | Concepts |
|------|----------|
| **Quick Start** | Category → Types → Functors → Monads |
| **Theoretical** | Category → Products → Natural Trans. → Limits → Yoneda → Adjunctions → Kan |
| **Practical Haskell** | Category → Types → Functors → Natural Trans. → Monads → Comonads |
| **Full Course** | Sequential (cat_001 → cat_024) |

---

## Part 1: Foundational Concepts

### Category (cat_001)
**Pages**: 20-29 | **Difficulty**: Beginner

**Core Definitions**:
- Objects and Morphisms
- Composition
- Associativity
- Identity

**Laws**:
```
Associativity: h ∘ (g ∘ f) = (h ∘ g) ∘ f
Identity: f ∘ id = f, id ∘ f = f
```

**Haskell**: Function composition (`.`), `id` function
**C++**: Template composition

**Enables**: Types, Products, Functors

---

### Types and Functions (cat_002)
**Pages**: 29-69 | **Difficulty**: Beginner
**Prerequisites**: Category

**Core Definitions**:
- Type as Set
- Pure Functions
- Void, Unit, Bool types

**Programming Concepts**:
- Static vs Dynamic Typing
- Strong vs Weak Typing
- Type Safety
- Memoization

**Haskell Types**: `Void`, `()`, `Bool`, `Integer`, `Int`

**Enables**: Products, Functors

---

### Products and Coproducts (cat_003)
**Pages**: 69-107 | **Difficulty**: Beginner
**Prerequisites**: Category

**Core Definitions**:
- Initial Object
- Terminal Object
- Product
- Coproduct
- Duality

**Universal Constructions**:
- Product: `(a, b)` with projections
- Coproduct: `Either a b` with injections

**Laws**:
- Uniqueness of morphisms
- Universal property

| Haskell | C++ |
|---------|-----|
| `(a, b)` | `std::pair` |
| `Either a b` | `std::variant` |

**Enables**: Function Types, Limits

---

## Part 2: Intermediate Concepts

### Functors (cat_006)
**Pages**: 107-152 | **Difficulty**: Intermediate
**Prerequisites**: Category, Types

**Core Definition**:
```haskell
fmap :: (a -> b) -> F a -> F b
```

**Functor Laws**:
```
Identity: fmap id = id
Composition: fmap (g . f) = fmap g . fmap f
```

**Common Functors**:
- Maybe
- List
- Reader
- Const
- Identity

**Haskell Typeclass**: `Functor`
**C++**: Template functor pattern

**Enables**: Bifunctors, Natural Transformations, Adjunctions, Monads

---

### Bifunctors and Profunctors (cat_007)
**Pages**: 131-172 | **Difficulty**: Intermediate
**Prerequisites**: Functors

**Operations**:
```haskell
bimap :: (a -> c) -> (b -> d) -> p a b -> p c d
contramap :: (b -> a) -> f a -> f b
dimap :: (a -> b) -> (c -> d) -> p b c -> p a d
```

**Examples**:
- Product `(,)`
- Coproduct `Either`
- Function `(->)`

---

### Function Types and Exponentials (cat_008)
**Pages**: 152-197 | **Difficulty**: Intermediate
**Prerequisites**: Products, Functors

**Core Definitions**:
- Exponential Object: `a => b`
- Currying
- Eval morphism
- Cartesian Closed Category

**Algebraic Identities**:
```
a^0 = 1
1^a = 1
a^1 = a
a^(b+c) = a^b × a^c
(a^b)^c = a^(b×c)
(a×b)^c = a^c × b^c
```

**Curry-Howard Correspondence**:
| Logic | Type |
|-------|------|
| false | Void |
| true | () |
| ∧ | × (Product) |
| ∨ | + (Sum) |
| → | (->) |

> Types are propositions, programs are proofs

---

### Natural Transformations (cat_009)
**Pages**: 172-197 | **Difficulty**: Intermediate
**Prerequisites**: Functors

**Core Definition**:
```
α :: F -> G
Component: αₐ :: F a -> G a
```

**Naturality Square**:
```
G f . αₐ = αᵦ . F f
```

**Haskell**: Polymorphic functions

**Examples**:
```haskell
safeHead :: [a] -> Maybe a
length :: [a] -> Const Int a
reverse :: [a] -> [a]
```

> Parametricity guarantees naturality (Theorems for Free)

**Enables**: Limits, Yoneda, Adjunctions

---

## Part 3: Advanced Concepts

### Limits and Colimits (cat_010)
**Pages**: 206-229 | **Difficulty**: Advanced
**Prerequisites**: Products, Natural Transformations

**Core Definitions**:
- Cone and Cocone
- Limit as Terminal Cone
- Colimit as Initial Cocone

**Special Cases**:

| Limit | Colimit |
|-------|---------|
| Terminal Object | Initial Object |
| Product | Coproduct |
| Equalizer | Coequalizer |
| Pullback | Pushout |

**Natural Isomorphism**:
```
C(c, Lim D) ≅ Nat(Δc, D)
```

---

### Free Monoids (cat_011)
**Pages**: 229-238 | **Difficulty**: Advanced
**Prerequisites**: Limits

- Free Monoid: List
- Forgetful Functor
- Free Functor
- Adjunction: `Free ⊣ Forgetful`

**Haskell**: `[a]` with `(++)` and `[]`

---

### Representable Functors (cat_012)
**Pages**: 238-249 | **Difficulty**: Advanced
**Prerequisites**: Functors, Natural Transformations

**Definition**: `F ≅ C(a, -)`

```haskell
tabulate :: (Rep f -> a) -> f a
index :: f a -> Rep f -> a

-- Law
tabulate . index = id
index . tabulate = id
```

**Examples**:
- Stream (representable by Int)
- Reader r (representable by r)

**Not Representable**: Maybe, List

---

### Yoneda Lemma (cat_013)
**Pages**: 249-261 | **Difficulty**: Advanced
**Prerequisites**: Natural Transformations, Representable Functors

**Statement**:
```
Nat(C(a, -), F) ≅ F a
```

**Haskell Form**:
```haskell
forall x. (a -> x) -> F x ≅ F a
```

> Natural transformations determined by single value

**Applications**:
- Continuation Passing Style
- Lens representation
- Performance optimization

---

### Yoneda Embedding (cat_014)
**Pages**: 261-271 | **Difficulty**: Advanced
**Prerequisites**: Yoneda Lemma

**Embedding**: `C → [C, Set]`

**Properties**:
- Contravariant
- Fully Faithful
- Embeds C into functor category

---

### Adjunctions (cat_015)
**Pages**: 280-307 | **Difficulty**: Advanced
**Prerequisites**: Natural Transformations, Free Monoids

**Core Definition**: `L ⊣ R`

```
Unit: η :: Id → R ∘ L
Counit: ε :: L ∘ R → Id
```

**Hom-set Isomorphism**:
```
C(L a, b) ≅ D(a, R b)
```

**Examples**:
- Free ⊣ Forgetful
- Product ⊣ Exponential
- Diagonal ⊣ Product
- (-) × a ⊣ (-)^a

> Every adjunction generates a monad

---

### Monads (cat_016)
**Pages**: 307-370 | **Difficulty**: Advanced
**Prerequisites**: Functors, Adjunctions

**Definition**: `(T, μ, η)` - Endofunctor with multiplication and unit

**Laws**:
```
Associativity: μ ∘ T μ = μ ∘ μ T
Left identity: μ ∘ η T = id
Right identity: μ ∘ T η = id
```

**Haskell Operations**:
```haskell
return :: a -> m a
(>>=) :: m a -> (a -> m b) -> m b
join :: m (m a) -> m a
(>=>) :: (a -> m b) -> (b -> m c) -> (a -> m c)
```

**Common Monads**:

| Monad | Use Case |
|-------|----------|
| Maybe | Partiality/Exceptions |
| List | Nondeterminism |
| Reader | Read-only state |
| Writer | Logging |
| State | Mutable state |
| IO | Interactive I/O |
| Cont | Continuations |

> Monad = Monoid in category of endofunctors

---

### Comonads (cat_017)
**Pages**: 355-370 | **Difficulty**: Advanced
**Prerequisites**: Monads

**Definition**: `(W, ε, δ)`

```haskell
extract :: W a -> a
duplicate :: W a -> W (W a)
(=>=) :: (W a -> b) -> (W b -> c) -> (W a -> c)
```

**Laws**:
```
extract ∘ duplicate = id
fmap extract ∘ duplicate = id
duplicate ∘ duplicate = fmap duplicate ∘ duplicate
```

**Common Comonads**:
- Product: Contextual computation
- Stream: Infinite streams / Digital filters
- Store: Lenses / Focus on data

---

### F-Algebras (cat_018)
**Pages**: 370-402 | **Difficulty**: Advanced
**Prerequisites**: Monads

**Definitions**:
- F-Algebra: `(a, F a -> a)`
- Coalgebra: `(a, a -> F a)`
- Initial Algebra / Terminal Coalgebra

**Lambek's Theorem**: Evaluator of initial algebra is isomorphism

**Fixed Point**: `Fix f = f (Fix f)`

**Recursion Schemes**:

| Scheme | Operation |
|--------|-----------|
| Catamorphism | fold/reduce |
| Anamorphism | unfold/generate |
| Hylomorphism | unfold then fold |

**Examples**:
- Natural numbers: Initial algebra of NatF
- Lists: Initial algebra of ListF
- Streams: Terminal coalgebra

---

## Part 4: Expert Concepts

### Ends and Coends (cat_019)
**Pages**: 402-419 | **Difficulty**: Expert
**Prerequisites**: Bifunctors, Yoneda

**Definitions**:
- End: `∫ₐ P(a, a)`
- Coend: `∫ᵃ P(a, a)`
- Wedge and Cowedge
- Dinatural Transformation

**Formulas**:
```
Natural transformations: Nat(F, G) ≅ ∫ₐ Set(F a, G a)
Ninja Yoneda: ∫ᵃ C(a, x) × F a ≅ F x
```

---

### Kan Extensions (cat_020)
**Pages**: 419-438 | **Difficulty**: Expert
**Prerequisites**: Limits, Ends/Coends

**Definitions**:
- Right Kan Extension: `Ran_K D`
- Left Kan Extension: `Lan_K D`

**Formulas**:
```
Ran_K D a ≅ ∫ᵢ Set(A(a, K i), D i)
Lan_K D a ≅ ∫ⁱ A(K i, a) × D i
```

**Adjunctions**:
- Ran_K is right adjoint to `(- ∘ K)`
- Lan_K is left adjoint to `(- ∘ K)`

> Generalizes limits, adjoints, monads

---

### Enriched Categories (cat_021)
**Pages**: 438-453 | **Difficulty**: Expert
**Prerequisites**: Adjunctions

- Enriched Category over V
- Monoidal Category V
- Hom-objects instead of hom-sets

**Examples**:
- Preorders enriched over (0,1)
- Metric spaces enriched over ([0,∞], +)
- 2-Categories enriched over Cat

---

### Topoi (cat_022)
**Pages**: 452-461 | **Difficulty**: Expert
**Prerequisites**: Function Types, Enriched Categories

**Definition**: Cartesian closed + limits + subobject classifier

**Properties**:
- Finite limits/colimits
- Exponentials
- Internal logic (intuitionistic)

**Applications**:
- Generalized set theory
- Foundations of mathematics
- Type theory

---

### Lawvere Theories (cat_023)
**Pages**: 461-480 | **Difficulty**: Expert
**Prerequisites**: Monads, F-Algebras

**Structure**:
- Based on FinSet^op
- Objects are powers of 1
- Morphisms encode operations and laws

**Relationship to Monads**:
- Every Lawvere theory induces a monad
- Every finitary monad has a Lawvere theory
- Models ≅ Algebras

> Better compositionality than monads

---

### Bicategories and Higher Categories (cat_024)
**Pages**: 480-491 | **Difficulty**: Expert
**Prerequisites**: Natural Transformations, Enriched Categories

**Definitions**:
- 2-Category: Objects, 1-cells, 2-cells
- Bicategory: Weak 2-category
- Horizontal and Vertical composition

**Examples**:
- Cat: Categories, Functors, Natural transformations
- Span: Sets, Spans, Span morphisms
- Prof: Categories, Profunctors, Natural transformations

> Category = Monad in Span

---

## Important Theorems

### Yoneda Lemma
```
Nat(C(a, -), F) ≅ F a
```
Pages: 249-256 | Shows natural transformations determined by single value

### Lambek's Theorem
Evaluator of initial algebra is isomorphism
Pages: 377-380 | Foundation for recursion schemes

### Curry-Howard Isomorphism
Types ↔ Propositions, Programs ↔ Proofs
Pages: 168-171 | Connects logic and computation

### Adjunction generates Monad
Every adjunction `L ⊣ R` gives monad `R ∘ L`
Pages: 299-303, 351-355

---

## Quick Reference

### By Practical Problem

| Problem | Solution | Concept |
|---------|----------|---------|
| Handling null | Maybe monad | cat_016 |
| Error handling | Either monad | cat_016 |
| Logging | Writer monad | cat_016 |
| State management | State monad | cat_016 |
| I/O operations | IO monad | cat_016 |
| List operations | List monad | cat_016 |
| Reading config | Reader monad | cat_016 |
| Data access | Lens (Store comonad) | cat_017 |
| Recursion | Catamorphism | cat_018 |
| Stream processing | Stream comonad | cat_017 |

### By Haskell Typeclass

| Typeclass | Concept | Pages |
|-----------|---------|-------|
| Functor | cat_006 | 110-122 |
| Bifunctor | cat_007 | 131-136 |
| Profunctor | cat_007 | 144-150 |
| Monad | cat_016 | 309-335 |
| Comonad | cat_017 | 356-363 |
| Adjunction | cat_015 | 286-291 |
| Representable | cat_012 | 242-248 |

---

## Reading Strategies

### First Time Reader
- **Approach**: Linear, skip exercises initially
- **Focus**: Understand definitions, run Haskell examples, visualize diagrams
- **Chapters**: Part One (1-9) first, then Part Two selectively

### Experienced Programmer
- **Approach**: Focus on practical applications
- **Focus**: Monad patterns, Functor usage, Type design
- **Chapters**: 1-2, 6-9, 16-17

### Mathematician
- **Approach**: Theoretical depth
- **Focus**: Universal constructions, Adjunctions, Kan extensions
- **Chapters**: All, emphasize 10, 13-15, 19-20

---

## Code Examples

| Language | Total Examples |
|----------|----------------|
| Haskell | 150+ |
| C++ | 50+ |

### Haskell by Concept
- **Category**: 5 examples (composition, identity)
- **Functors**: 20 examples (fmap, instances, laws)
- **Monads**: 40 examples (bind, return, do notation)
- **F-Algebras**: 15 examples (catamorphism, fold)

---

## Exercises

**Total Challenges**: 100+

| Concept | Count | Pages |
|---------|-------|-------|
| Category | 6 | 28-29 |
| Types | 8 | 43-45 |
| Products | 7 | 88-89 |
| Functors | 4 | 129 |
| Natural Trans. | 6 | 195-197 |
| Yoneda | 3 | 259-260 |
| Adjunctions | 3 | 297-299 |
| F-Algebras | 5 | 388 |
